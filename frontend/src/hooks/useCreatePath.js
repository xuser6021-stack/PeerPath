import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useCreatePath() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPath = async ({ title, description, category, difficulty, steps }) => {
    setLoading(true);
    setError(null);
    try {
      // Insert path row
      const { data: pathData, error: pathErr } = await supabase
        .from('paths')
        .insert({ title, description, category, difficulty })
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
        const originalStep = steps.find((s) => s.title === stepRow.title && s.description === stepRow.description);
        // If exact match not found, fallback to order index
        const stepIdx = steps.findIndex((s) => s.title === stepRow.title && s.description === stepRow.description);
        const stepObj = steps[stepIdx];
        if (stepObj && stepObj.resources) {
          stepObj.resources.forEach((res) => {
            resourceInserts.push({
              step_id: stepRow.id,
              title: res.title,
              url: res.url,
              type: res.type,
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPath, loading, error };
}
