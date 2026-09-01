import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  Layers,
  X,
  PlayCircle,
  FileText,
  BookOpen,
  GraduationCap,
  Code2,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Card, Badge } from '../components/common';

const CATEGORY_OPTIONS = [
  'Web Dev',
  'Data Science',
  'Design',
  'AI/ML',
  'Cybersecurity',
  'Other',
];

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const RESOURCE_TYPES = [
  { value: 'Video', icon: PlayCircle },
  { value: 'Article', icon: BookOpen },
  { value: 'Doc', icon: FileText },
  { value: 'Course', icon: GraduationCap },
  { value: 'Project', icon: Code2 },
];

export default function CreatePath() {
  const navigate = useNavigate();

  // 1. Path Metadata State
  const [metadata, setMetadata] = useState({
    title: 'Distributed Systems & Microservices in Go',
    description: 'Learn how to build resilient, highly scalable distributed services with consensus algorithms, gRPC streaming, and event-driven architectures.',
    category: 'Web Dev',
    difficulty: 'Intermediate',
  });

  // 2. Steps & Nested Resources State
  const [steps, setSteps] = useState([
    {
      id: 'step-1',
      title: 'Go Concurrency & Goroutine Patterns',
      description: 'Master channels, worker pools, sync.Mutex, and context cancellation pipelines.',
      resources: [
        {
          id: 'res-1-1',
          title: 'Effective Go & Concurrency Patterns Guide',
          url: 'https://go.dev/doc/effective_go#concurrency',
          type: 'Doc',
        },
        {
          id: 'res-1-2',
          title: 'Deep Dive: Channels & Mutexes Under the Hood',
          url: 'https://youtube.com/watch?v=example-go-concurrency',
          type: 'Video',
        },
      ],
    },
    {
      id: 'step-2',
      title: 'gRPC & Protocol Buffers Service Communication',
      description: 'Define schema contracts, compile proto files, implement streaming RPCs and middleware.',
      resources: [
        {
          id: 'res-2-1',
          title: 'Official gRPC Go Quickstart & Schema Definitions',
          url: 'https://grpc.io/docs/languages/go/quickstart/',
          type: 'Doc',
        },
        {
          id: 'res-2-2',
          title: 'Hands-on Lab: Real-Time Stream Processor in Go',
          url: 'https://github.com/example/grpc-go-lab',
          type: 'Project',
        },
      ],
    },
  ]);

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Metadata handlers
  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  // Step handlers
  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: '',
      description: '',
      resources: [
        {
          id: `res-${Date.now()}-1`,
          title: '',
          url: '',
          type: 'Article',
        },
      ],
    };
    setSteps((prev) => [...prev, newStep]);
    toast.success(`Added Step ${steps.length + 1}`);
  };

  const handleRemoveStep = (stepId) => {
    if (steps.length <= 1) {
      toast.error('A path must have at least one step milestone.');
      return;
    }
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
    toast('Step removed', { icon: '🗑️' });
  };

  const handleStepChange = (stepId, field, value) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    );
  };

  // Step reordering (Up / Down)
  const handleMoveStep = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    setSteps((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  // Resource handlers
  const handleAddResource = (stepId) => {
    const newResource = {
      id: `res-${Date.now()}`,
      title: '',
      url: '',
      type: 'Article',
    };
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, resources: [...step.resources, newResource] }
          : step
      )
    );
  };

  const handleRemoveResource = (stepId, resourceId) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            resources: step.resources.filter((r) => r.id !== resourceId),
          };
        }
        return step;
      })
    );
  };

  const handleResourceChange = (stepId, resourceId, field, value) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            resources: step.resources.map((r) =>
              r.id === resourceId ? { ...r, [field]: value } : r
            ),
          };
        }
        return step;
      })
    );
  };

  // Publish / Save Draft actions
  const handleSaveDraft = () => {
    toast.success('Path saved to drafts!');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!metadata.title.trim()) {
      toast.error('Please provide a path title');
      return;
    }
    toast.success('Path published to the community catalog! 🎉');
    navigate('/explore');
  };

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-6 space-y-10">
      {/* 1. PAGE HEADING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create a path
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Design a new learning path, organize milestones, and share vetted resources with peers.
          </p>
        </div>
        <Badge variant="primary" dot className="self-start sm:self-auto">
          Drafting Mode
        </Badge>
      </div>

      <form onSubmit={handlePublish} className="space-y-10">
        {/* 2. PATH METADATA CARD */}
        <Card className="p-6 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-500" />
              Path Overview & Metadata
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set the foundation, scope, and target audience for this curriculum.
            </p>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="path-title"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Path Title <span className="text-danger-500">*</span>
              </label>
              <input
                id="path-title"
                type="text"
                required
                value={metadata.title}
                onChange={(e) => handleMetadataChange('title', e.target.value)}
                placeholder="e.g. Distributed Systems & Microservices in Go"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="path-description"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Description & Learning Goal <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="path-description"
                rows={3}
                required
                value={metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                placeholder="Explain what learners will build, the key takeaways, and prerequisites..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Category & Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Category Select */}
              <div>
                <label
                  htmlFor="path-category"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Primary Category
                </label>
                <select
                  id="path-category"
                  value={metadata.category}
                  onChange={(e) => handleMetadataChange('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer font-medium"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Three-Way Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {DIFFICULTY_LEVELS.map((level) => {
                    const isSelected = metadata.difficulty === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleMetadataChange('difficulty', level)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. STEPS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Curriculum Steps & Milestones
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {steps.length} {steps.length === 1 ? 'step' : 'steps'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Break your curriculum into sequential milestones with curated learning resources.
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-5">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className="p-5 sm:p-6 relative border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Step Card Header */}
                <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    {/* Drag handle & Up/Down reorder controls */}
                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <GripVertical className="w-5 h-5 cursor-grab active:cursor-grabbing hover:text-slate-700 dark:hover:text-slate-300" />
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveStep(index, 'up')}
                          className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                          title="Move step up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === steps.length - 1}
                          onClick={() => handleMoveStep(index, 'down')}
                          className="p-0.5 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
                          title="Move step down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/80 border border-primary-200/80 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Remove Step Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id, index)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors cursor-pointer"
                    title="Remove this step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Step Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      required
                      value={step.title}
                      onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                      placeholder="e.g. Core Concurrency & Goroutine Architecture"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Step Description
                    </label>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => handleStepChange(step.id, 'description', e.target.value)}
                      placeholder="Explain what the learner should study, practice, or build..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>

                  {/* Nested Resources Section */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Curated Resources ({step.resources.length})
                      </span>
                    </div>

                    {/* Resource Rows (Stacks vertically on mobile, responsive grid on desktop) */}
                    <div className="space-y-2.5">
                      {step.resources.map((res, rIdx) => (
                        <div
                          key={res.id || rIdx}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80"
                        >
                          {/* Type Select */}
                          <div className="sm:w-32 shrink-0">
                            <select
                              value={res.type}
                              onChange={(e) =>
                                handleResourceChange(step.id, res.id, 'type', e.target.value)
                              }
                              className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                            >
                              {RESOURCE_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.value}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Resource Title Input */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={res.title}
                              onChange={(e) =>
                                handleResourceChange(step.id, res.id, 'title', e.target.value)
                              }
                              placeholder="Resource Title (e.g. Official Go Docs)"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>

                          {/* Resource URL Input */}
                          <div className="flex-1">
                            <input
                              type="url"
                              value={res.url}
                              onChange={(e) =>
                                handleResourceChange(step.id, res.id, 'url', e.target.value)
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>

                          {/* Remove Resource Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveResource(step.id, res.id)}
                            className="self-end sm:self-center p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Remove resource"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Resource Button */}
                    <button
                      type="button"
                      onClick={() => handleAddResource(step.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add resource</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 4. FULL-WIDTH DASHED "+ ADD STEP" BUTTON */}
          <button
            type="button"
            onClick={handleAddStep}
            className="w-full py-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-400 bg-white/50 dark:bg-slate-900/40 hover:bg-primary-50/30 dark:hover:bg-primary-950/20 text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 shadow-xs cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add next step milestone</span>
          </button>
        </section>

        {/* 5. STICKY BOTTOM ACTION BAR */}
        <div className="sticky bottom-4 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            <span>All curriculum updates saved locally</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleSaveDraft}
            >
              Save as draft
            </Button>

            {/* Preview link / modal trigger */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={Sparkles}
              className="shadow-md shadow-primary-500/20 font-semibold"
            >
              Publish path
            </Button>
          </div>
        </div>
      </form>

      {/* READ-ONLY PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{metadata.category}</Badge>
                <Badge variant="neutral">{metadata.difficulty}</Badge>
                <Badge variant="success" dot>Health 100</Badge>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Body */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {metadata.title || 'Untitled Learning Path'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {metadata.description || 'No description provided yet.'}
              </p>
            </div>

            {/* Step list preview */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Curriculum Syllabus ({steps.length} steps)
              </h3>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        Step {idx + 1}:
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {step.title || 'Untitled Step'}
                      </span>
                    </div>
                    {step.description && (
                      <p className="text-xs text-slate-500">{step.description}</p>
                    )}
                    {step.resources.length > 0 && (
                      <div className="text-[11px] text-slate-400 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                        {step.resources.length} curated {step.resources.length === 1 ? 'resource' : 'resources'} attached
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="primary" onClick={() => setIsPreviewOpen(false)}>
                Back to Editor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
