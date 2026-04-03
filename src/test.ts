import { createProject, getProjects } from './core/storage';

async function runTest() {
  console.log('Creating project...');

  await createProject({
    name: 'Test Project',
  });

  const projects = await getProjects();

  console.log('Projects:', projects);
}

runTest();
