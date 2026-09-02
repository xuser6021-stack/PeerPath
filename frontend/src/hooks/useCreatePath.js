import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useCreatePath() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPath = async ({ title, description, category, difficulty, steps, is_public }) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error('You must be signed in to create a path.');

      // Insert path row
      const { data: pathData, error: pathErr } = await supabase
        .from('paths')
        .insert({ title, description, category, difficulty, is_public, author_id: user.id })
        .select('id')
        .single();
      if (pathErr) throw new Error(`Path insert failed: ${pathErr.message}`);
      const pathId = pathData.id;

      // Insert steps sequentially with order_index
      const stepInserts = steps.map((step, idx) => ({
        path_id: pathId,
        title: step.title,
        description: step.description,
        order_index: idx + 1,
      }));
      const { data: insertedSteps, error: stepsErr } = await supabase
        .from('steps')
        .insert(stepInserts)
        .select('id, order_index');
      if (stepsErr) throw new Error(`Steps insert failed: ${stepsErr.message}`);

      // Insert resources for each step
      const resourceInserts = [];
      insertedSteps.forEach((stepRow) => {
        const stepObj = steps[stepRow.order_index - 1];
        if (stepObj && stepObj.resources) {
          stepObj.resources.forEach((res) => {
            resourceInserts.push({
              step_id: stepRow.id,
              title: res.title,
              url: res.url,
              type: res.type?.toLowerCase(),
            });
          });
        }
      });
        if (resourceInserts.length > 0) {
          const { error: resErr } = await supabase.from('resources').insert(resourceInserts);
          if (resErr) throw new Error(`Resources insert failed: ${resErr.message}`);
        }

      return { pathId };
    } catch (e) {
      console.error(e);
      setError(e);
      return { error: e };
    } finally {
      setLoading(false);
    }
  };

  const forkPath = async (pathId) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error('You must be signed in to fork a path.');

      const { data: sourcePath, error: pathErr } = await supabase
        .from('paths')
        .select('title, description, category, difficulty')
        .eq('id', pathId)
        .single();
      if (pathErr) throw pathErr;

      const { data: sourceSteps, error: stepsErr } = await supabase
        .from('steps')
        .select('id, title, description, order_index')
        .eq('path_id', pathId)
        .order('order_index', { ascending: true });
      if (stepsErr) throw stepsErr;

      const { data: newPath, error: newPathErr } = await supabase
        .from('paths')
        .insert({
          ...sourcePath,
          author_id: user.id,
          forked_from: pathId,
        })
        .select('id')
        .single();
      if (newPathErr) throw newPathErr;

      const { data: newSteps, error: newStepsErr } = await supabase
        .from('steps')
        .insert(sourceSteps.map((step) => ({
          path_id: newPath.id,
          title: step.title,
          description: step.description,
          order_index: step.order_index,
        })))
        .select('id, order_index');
      if (newStepsErr) throw newStepsErr;

      const oldResources = [];
      for (const step of sourceSteps) {
        const { data: resources, error: resourcesErr } = await supabase
          .from('resources')
          .select('title, url, type')
          .eq('step_id', step.id);
        if (resourcesErr) throw resourcesErr;
        oldResources.push({ orderIndex: step.order_index, resources });
      }

      const resourceInserts = newSteps.flatMap((step) => {
        const source = oldResources.find((item) => item.orderIndex === step.order_index);
        return (source?.resources || []).map((resource) => ({ ...resource, type: resource.type?.toLowerCase(), step_id: step.id }));
      });
      if (resourceInserts.length > 0) {
        const { error: resourcesErr } = await supabase.from('resources').insert(resourceInserts);
        if (resourcesErr) throw resourcesErr;
      }

      return { pathId: newPath.id };
    } catch (e) {
      console.error(e);
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPath, forkPath, loading, error };
}
