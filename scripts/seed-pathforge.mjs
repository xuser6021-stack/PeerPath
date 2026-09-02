import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const candidates = [
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../frontend/.env'),
  ];
  const values = {};
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && !values[key]) values[key] = value;
    }
  }
  return values;
}

const env = loadEnv();
const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in a local .env file.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  { username: 'maya.chen', email: 'maya.chen@pathforge.demo', bio: 'Data engineer turning messy systems into reliable, observable products.' },
  { username: 'jon.bell', email: 'jon.bell@pathforge.demo', bio: 'Frontend architect focused on accessible interfaces and resilient web platforms.' },
  { username: 'sofia.morales', email: 'sofia.morales@pathforge.demo', bio: 'Product designer exploring systems thinking, research, and inclusive design.' },
  { username: 'ravi.patel', email: 'ravi.patel@pathforge.demo', bio: 'Applied ML builder interested in practical evaluation and useful AI products.' },
  { username: 'nora.williams', email: 'nora.williams@pathforge.demo', bio: 'Security-minded platform engineer who enjoys making infrastructure understandable.' },
  { username: 'eli.grant', email: 'eli.grant@pathforge.demo', bio: 'Full-stack learner documenting the small decisions behind dependable software.' },
];

const paths = [
  {
    title: 'Full-stack developer with React and Node.js', category: 'Web Dev', difficulty: 'Intermediate', author: 0,
    description: 'Build and ship a production-quality web application from accessible UI through tested APIs, data modeling, and deployment.',
    steps: [
      ['Modern JavaScript foundations', 'Refresh modules, async control flow, testing habits, and the language features used throughout a full-stack codebase.', [['article', 'JavaScript.info: The Modern JavaScript Tutorial', 'https://javascript.info/'], ['video', 'Frontend Masters: JavaScript: The Hard Parts', 'https://frontendmasters.com/courses/javascript-hard-parts-v2/']]],
      ['React application architecture', 'Compose accessible interfaces with modern React, predictable state boundaries, and maintainable component APIs.', [['doc', 'React Documentation: Thinking in React', 'https://react.dev/learn/thinking-in-react'], ['article', 'Kent C. Dodds: Application State Management', 'https://kentcdodds.com/blog/application-state-management']]],
      ['Node.js APIs and data modeling', 'Design versioned HTTP APIs, validate inputs, and connect application behavior to a relational data model.', [['doc', 'Node.js Learn: HTTP and File System APIs', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'], ['article', 'PostgreSQL: Data Modeling Best Practices', 'https://www.postgresql.org/docs/current/ddl-basics.html']]],
      ['Testing and production readiness', 'Cover unit, integration, and browser tests while adding logging, error boundaries, and useful operational signals.', [['doc', 'Testing Library: Guiding Principles', 'https://testing-library.com/docs/guiding-principles/'], ['article', 'OWASP: API Security Top 10', 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/']]],
      ['Deploying the complete product', 'Move from local development to a repeatable deployment with environment configuration and a rollback plan.', [['doc', 'Vercel: Production Checklist', 'https://vercel.com/docs/production-checklist'], ['project', 'GitHub Actions: Building and Testing Node.js', 'https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs']]],
    ],
  },
  {
    title: 'Practical data science with Python', category: 'Data Science', difficulty: 'Intermediate', author: 1,
    description: 'Turn a real-world dataset into a reproducible analysis, a defensible model, and a clear story for decision makers.',
    steps: [
      ['Python for analysis', 'Use environments, notebooks, functions, and typing conventions that keep exploratory work reproducible.', [['doc', 'Python Documentation: Data Structures', 'https://docs.python.org/3/tutorial/datastructures.html'], ['course', 'Real Python: NumPy, pandas, and Data Science', 'https://realpython.com/tutorials/data-science/']]],
      ['Cleaning and exploring datasets', 'Inspect missingness, outliers, distributions, and data quality before drawing conclusions.', [['doc', 'pandas User Guide: 10 Minutes to pandas', 'https://pandas.pydata.org/docs/user_guide/10min.html'], ['article', 'R for Data Science: Data Transformation', 'https://r4ds.hadley.nz/transform.html']]],
      ['Statistics for decisions', 'Build intuition for uncertainty, sampling, confidence intervals, and experiments.', [['article', 'Seeing Theory: A Visual Introduction to Probability', 'https://seeing-theory.brown.edu/'], ['doc', 'SciPy Statistics Reference', 'https://docs.scipy.org/doc/scipy/reference/stats.html']]],
      ['Machine learning workflows', 'Create a baseline, prevent leakage, compare models, and evaluate with metrics that match the real cost of errors.', [['doc', 'scikit-learn: Model Evaluation', 'https://scikit-learn.org/stable/modules/model_evaluation.html'], ['course', 'Made With ML: MLOps Course', 'https://madewithml.com/']]],
      ['Communicating the result', 'Present assumptions, limitations, and recommendations through a focused report or dashboard.', [['article', 'Storytelling with Data: Resources', 'https://www.storytellingwithdata.com/resources'], ['project', 'Observable: Data Visualization Notebooks', 'https://observablehq.com/']]],
    ],
  },
  {
    title: 'Product design systems from research to tokens', category: 'Design', difficulty: 'Beginner', author: 2,
    description: 'Create a small, thoughtful design system that connects user research, interaction patterns, visual tokens, and handoff.',
    steps: [
      ['Researching the product problem', 'Frame user needs, map journeys, and turn evidence into a focused design opportunity.', [['article', 'Nielsen Norman Group: User Interviews', 'https://www.nngroup.com/articles/user-interviews/'], ['doc', 'IDEO Design Kit: Methods', 'https://www.designkit.org/methods']]],
      ['Information architecture', 'Organize content and flows so people can predict where they are and what happens next.', [['article', 'Nielsen Norman Group: Information Architecture', 'https://www.nngroup.com/articles/definition-information-architecture/'], ['doc', 'Figma: User Flow Templates', 'https://www.figma.com/templates/user-flow/']]],
      ['Interaction and visual foundations', 'Define spacing, typography, color, and interaction states as a coherent visual language.', [['doc', 'Material Design: Foundations', 'https://m3.material.io/foundations'], ['article', 'A11y Project: Color Contrast', 'https://www.a11yproject.com/posts/what-is-color-contrast/']]],
      ['Components and design tokens', 'Build flexible components with explicit variants, states, and tokens that scale beyond a single screen.', [['doc', 'Figma Variables Documentation', 'https://help.figma.com/hc/en-us/articles/15339657135383-Create-and-use-variables'], ['article', 'Nathan Curtis: Design Tokens', 'https://medium.com/eightshapes-llc/tokens-in-design-systems-25c2a5f2c14f']]],
      ['Handoff and validation', 'Document behavior, test prototypes with users, and create a feedback loop with engineering.', [['doc', 'Figma: Dev Mode', 'https://help.figma.com/hc/en-us/articles/1502312464422-Guide-to-Dev-Mode'], ['article', 'Inclusive Components by Heydon Pickering', 'https://inclusive-components.design/']]],
    ],
  },
  {
    title: 'Production AI applications and evaluation', category: 'AI/ML', difficulty: 'Advanced', author: 3,
    description: 'Design an AI feature with retrieval, structured outputs, evaluation datasets, safety checks, and transparent operations.',
    steps: [
      ['Problem framing and model selection', 'Choose a narrow user outcome, establish a baseline, and understand where model uncertainty matters.', [['article', 'Chip Huyen: Introduction to Machine Learning Systems Design', 'https://huyenchip.com/ml-interviews-book/'], ['doc', 'OpenAI: Model Selection Guide', 'https://platform.openai.com/docs/models']]],
      ['Embeddings and retrieval', 'Build a retrieval pipeline with chunking, metadata, hybrid search, and relevance checks.', [['doc', 'Pinecone: Retrieval Augmented Generation', 'https://www.pinecone.io/learn/retrieval-augmented-generation/'], ['article', 'Weaviate: Hybrid Search', 'https://weaviate.io/developers/weaviate/search/hybrid']]],
      ['Reliable generation', 'Use schemas, citations, retries, and prompt versioning to make generated responses easier to inspect.', [['doc', 'OpenAI: Structured Outputs', 'https://platform.openai.com/docs/guides/structured-outputs'], ['article', 'Simon Willison: LLM Patterns', 'https://simonwillison.net/2023/Apr/7/conversational-ai/']]],
      ['Evaluation and safety', 'Create representative test sets, measure regressions, and design abuse and privacy protections.', [['doc', 'OpenAI Evals', 'https://github.com/openai/evals'], ['article', 'NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework']]],
      ['Observability and delivery', 'Monitor latency, cost, quality, and user feedback as the feature moves into production.', [['article', 'Arize: LLM Observability Guide', 'https://arize.com/llm-observability/'], ['project', 'Langfuse: Open Source LLM Engineering Platform', 'https://langfuse.com/docs']]],
    ],
  },
  {
    title: 'Application security for modern teams', category: 'Cybersecurity', difficulty: 'Intermediate', author: 4,
    description: 'Learn a practical security workflow for web applications: threat modeling, secure coding, identity, testing, and response.',
    steps: [
      ['Threat modeling fundamentals', 'Identify assets, trust boundaries, abuse cases, and mitigations before implementation hardens assumptions.', [['doc', 'OWASP Threat Modeling', 'https://owasp.org/www-community/Threat_Modeling'], ['article', 'Microsoft: Threat Modeling Tool', 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool']]],
      ['Secure web foundations', 'Understand browser boundaries, injection risks, security headers, and safe handling of untrusted input.', [['doc', 'OWASP Web Security Testing Guide', 'https://owasp.org/www-project-web-security-testing-guide/'], ['article', 'MDN: Content Security Policy', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP']]],
      ['Identity and authorization', 'Implement secure sessions, least privilege, and authorization checks at the resource boundary.', [['doc', 'OWASP: Authentication Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'], ['article', 'Auth0: RBAC Best Practices', 'https://auth0.com/docs/manage-users/access-control/rbac']]],
      ['Dependency and supply-chain risk', 'Inventory dependencies, verify builds, and respond quickly to vulnerable packages and secrets exposure.', [['doc', 'OpenSSF Scorecard', 'https://scorecard.dev/'], ['article', 'GitHub: Secret Scanning', 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning']]],
      ['Security testing and response', 'Make security tests repeatable and establish a calm, documented incident response process.', [['doc', 'OWASP ASVS', 'https://owasp.org/www-project-application-security-verification-standard/'], ['article', 'Google SRE: Incident Management', 'https://sre.google/sre-book/managing-incidents/']]],
    ],
  },
];

const reviewComments = [
  'Clear explanations and a useful progression. I used this as the outline for a project at work.',
  'The practical examples were strong, especially the section on evaluating trade-offs.',
  'A thoughtful path with excellent references. I would recommend it to anyone starting here.',
  'Helpful overall, although one resource could use a more current example.',
  'The milestones made a broad subject feel manageable and gave me a concrete next step.',
];

function log(message) {
  console.log(`[seed] ${message}`);
}

async function removeRows(table, column) {
  const { error } = await supabase.from(table).delete().not(column, 'is', null);
  if (error) throw new Error(`Could not clear ${table}: ${error.message}`);
  log(`Cleared ${table}`);
}

async function clearDatabase() {
  const tables = [
    ['suggestions', 'id'],
    ['group_members', 'group_id'],
    ['groups', 'id'],
    ['progress', 'user_id'],
    ['reviews', 'id'],
    ['resources', 'id'],
    ['steps', 'id'],
    ['paths', 'id'],
    ['profiles', 'id'],
  ];
  for (const [table, column] of tables) await removeRows(table, column);
}

async function removePreviousDemoUsers() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`Could not list auth users: ${error.message}`);
  for (const user of data.users.filter((item) => item.email?.endsWith('@pathforge.demo'))) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) throw new Error(`Could not remove ${user.email}: ${deleteError.message}`);
    log(`Removed previous auth user: ${user.email}`);
  }
}

async function clearDemoData() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`Could not list auth users: ${error.message}`);
  const demoUserIds = data.users.filter((user) => user.email?.endsWith('@pathforge.demo')).map((user) => user.id);
  if (demoUserIds.length === 0) {
    log('No seeded demo users found');
    return;
  }

  const { data: demoPaths, error: pathsError } = await supabase.from('paths').select('id').in('author_id', demoUserIds);
  if (pathsError) throw pathsError;
  const pathIds = (demoPaths || []).map((path) => path.id);
  const { data: demoSteps, error: stepsError } = pathIds.length ? await supabase.from('steps').select('id').in('path_id', pathIds) : { data: [], error: null };
  if (stepsError) throw stepsError;
  const stepIds = (demoSteps || []).map((step) => step.id);
  const { data: demoResources, error: resourcesError } = stepIds.length ? await supabase.from('resources').select('id').in('step_id', stepIds) : { data: [], error: null };
  if (resourcesError) throw resourcesError;
  const resourceIds = (demoResources || []).map((resource) => resource.id);

  if (resourceIds.length) await removeWhereIn('suggestions', 'resource_id', resourceIds);
  const { data: demoGroups, error: groupsError } = pathIds.length ? await supabase.from('groups').select('id').in('path_id', pathIds) : { data: [], error: null };
  if (groupsError) throw groupsError;
  const groupIds = (demoGroups || []).map((group) => group.id);
  if (groupIds.length) await removeWhereIn('group_members', 'group_id', groupIds);
  if (pathIds.length) await removeWhereIn('groups', 'path_id', pathIds);
  if (demoUserIds.length) await removeWhereIn('progress', 'user_id', demoUserIds);
  if (resourceIds.length) await removeWhereIn('reviews', 'resource_id', resourceIds);
  if (stepIds.length) await removeWhereIn('resources', 'step_id', stepIds);
  if (pathIds.length) await removeWhereIn('steps', 'path_id', pathIds);
  if (pathIds.length) await removeWhereIn('paths', 'id', pathIds);
  await removeWhereIn('profiles', 'id', demoUserIds);
  for (const userId of demoUserIds) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;
  }
  log(`Removed ${demoUserIds.length} seeded demo users and their related data`);
}

async function removeWhereIn(table, column, values) {
  const { error } = await supabase.from(table).delete().in(column, values);
  if (error) throw new Error(`Could not clear seeded ${table}: ${error.message}`);
}

async function createUsers() {
  const created = [];
  for (const demoUser of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: demoUser.email,
      password: 'PathForgeDemo!2026',
      email_confirm: true,
      user_metadata: { username: demoUser.username },
    });
    if (error) throw new Error(`Could not create ${demoUser.email}: ${error.message}`);
    created.push(data.user);
  }
  const { error } = await supabase.from('profiles').upsert(users.map((demoUser, index) => ({
    id: created[index].id,
    username: demoUser.username,
    bio: demoUser.bio,
  })), { onConflict: 'id' });
  if (error) throw new Error(`Could not insert profiles: ${error.message}`);
  log(`Created ${created.length} users and matching profiles`);
  return created;
}

async function createPaths(authUsers) {
  const createdPaths = [];
  const createdResources = [];
  for (const pathSpec of paths) {
    const { data: pathRow, error: pathError } = await supabase.from('paths').insert({
      title: pathSpec.title,
      description: pathSpec.description,
      category: pathSpec.category,
      difficulty: pathSpec.difficulty,
      author_id: authUsers[pathSpec.author].id,
      is_public: true,
    }).select('id').single();
    if (pathError) throw new Error(`Could not create path ${pathSpec.title}: ${pathError.message}`);

    const stepRows = pathSpec.steps.map((step, index) => ({
      path_id: pathRow.id,
      title: step[0],
      description: step[1],
      order_index: index + 1,
    }));
    const { data: insertedSteps, error: stepsError } = await supabase.from('steps').insert(stepRows).select('id, order_index');
    if (stepsError) throw new Error(`Could not create steps for ${pathSpec.title}: ${stepsError.message}`);

    const resourceRows = [];
    pathSpec.steps.forEach((step, index) => {
      step[2].forEach(([type, title, url]) => resourceRows.push({
        step_id: insertedSteps.find((row) => row.order_index === index + 1).id,
        title,
        url,
        type,
      }));
    });
    const { data: insertedResources, error: resourcesError } = await supabase.from('resources').insert(resourceRows).select('id, step_id, title, url, type');
    if (resourcesError) throw new Error(`Could not create resources for ${pathSpec.title}: ${resourcesError.message}`);
    createdPaths.push({ ...pathSpec, id: pathRow.id, steps: insertedSteps });
    createdResources.push(...insertedResources);
    log(`Created path: ${pathSpec.title} (${insertedSteps.length} steps, ${insertedResources.length} resources)`);
  }
  return { createdPaths, createdResources };
}

async function createReviews(authUsers, resources) {
  const reviewRows = resources.slice(0, 28).map((resource, index) => ({
    resource_id: resource.id,
    user_id: authUsers[(index + 1) % authUsers.length].id,
    rating: [5, 5, 4, 5, 4, 5, 2][index % 7],
    comment: reviewComments[index % reviewComments.length],
  }));
  const { error } = await supabase.from('reviews').insert(reviewRows);
  if (error) throw new Error(`Could not create reviews: ${error.message}`);
  log(`Created ${reviewRows.length} reviews`);
  return reviewRows;
}

async function createProgress(authUsers, createdPaths) {
  const rows = [];
  const assignments = [
    { user: 0, path: 0, completed: 4 },
    { user: 1, path: 0, completed: 2 },
    { user: 2, path: 1, completed: 3 },
    { user: 5, path: 1, completed: 5 },
  ];
  assignments.forEach(({ user, path: pathIndex, completed }) => {
    const pathSpec = createdPaths[pathIndex];
    pathSpec.steps.forEach((step, index) => rows.push({
      user_id: authUsers[user].id,
      path_id: pathSpec.id,
      step_id: step.id,
      completed: index < completed,
      completed_at: index < completed ? new Date(Date.now() - (completed - index) * 86400000).toISOString() : null,
    }));
  });
  const { error } = await supabase.from('progress').insert(rows);
  if (error) throw new Error(`Could not create progress: ${error.message}`);
  log(`Created ${rows.length} progress rows across 4 learner/path assignments`);
  return rows;
}

async function createGroup(authUsers, path) {
  const { data: group, error: groupError } = await supabase.from('groups').insert({ path_id: path.id }).select('id').single();
  if (groupError) throw new Error(`Could not create peer group: ${groupError.message}`);
  const { error: membersError } = await supabase.from('group_members').insert([0, 1, 5].map((index) => ({ group_id: group.id, user_id: authUsers[index].id })));
  if (membersError) throw new Error(`Could not add group members: ${membersError.message}`);
  log(`Created peer group on ${path.title} with 3 members`);
}

async function createSuggestions(authUsers, resources, createdPaths) {
  const firstPathResources = resources.filter((resource) => createdPaths[0].steps.some((step) => step.id === resource.step_id));
  const suggestions = [
    { resource: firstPathResources[0], user: 2, title: 'React.dev: Managing State', url: 'https://react.dev/learn/managing-state', reason: 'A current React guide with better coverage of state ownership and composition.', votes: 6, status: 'pending' },
    { resource: firstPathResources[1], user: 5, title: 'Node.js Best Practices', url: 'https://github.com/goldberglearning/nodebestpractices', reason: 'This actively maintained reference is more useful than the older introductory material.', votes: 9, status: 'pending' },
    { resource: resources[12], user: 0, title: 'The Missing README', url: 'https://www.themissingreadme.com/', reason: 'A concise, practical alternative with examples that match current engineering teams.', votes: 3, status: 'pending' },
    { resource: resources[20], user: 4, title: 'OWASP Application Security Verification Standard', url: 'https://owasp.org/www-project-application-security-verification-standard/', reason: 'The ASVS gives the team a more actionable verification checklist.', votes: 10, status: 'accepted' },
  ];
  const rows = suggestions.map((suggestion) => ({
    resource_id: suggestion.resource.id,
    suggested_by: authUsers[suggestion.user].id,
    suggested_title: suggestion.title,
    suggested_url: suggestion.url,
    reason: suggestion.reason,
    votes: suggestion.votes,
    status: suggestion.status,
  }));
  const { error } = await supabase.from('suggestions').insert(rows);
  if (error) throw new Error(`Could not create suggestions: ${error.message}`);
  log(`Created ${rows.length} suggestions (including one accepted and one at the merge threshold)`);
  return rows;
}

async function main() {
  log('Starting PathForge demo seed');
  if (process.argv.includes('--clear-demo')) {
    await clearDemoData();
    log('Demo cleanup complete');
    return;
  }
  await clearDatabase();
  await removePreviousDemoUsers();
  const authUsers = await createUsers();
  const { createdPaths, createdResources } = await createPaths(authUsers);
  const reviews = await createReviews(authUsers, createdResources);
  const progress = await createProgress(authUsers, createdPaths);
  await createGroup(authUsers, createdPaths[0]);
  const suggestions = await createSuggestions(authUsers, createdResources, createdPaths);
  log('Seed complete');
  console.log(`\nSummary: ${authUsers.length} users, ${createdPaths.length} paths, ${createdPaths.reduce((sum, item) => sum + item.steps.length, 0)} steps, ${createdResources.length} resources, ${reviews.length} reviews, ${progress.length} progress rows, 1 group, ${suggestions.length} suggestions.`);
}

main().catch((error) => {
  console.error(`[seed] Failed: ${error.message}`);
  process.exitCode = 1;
});
