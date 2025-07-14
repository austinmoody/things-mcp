#!/usr/bin/env node

/**
 * Test Project Templates - Manual test for project template functionality
 * 
 * This script demonstrates how to use the ThingsClient to create projects
 * from predefined templates. It shows the project template capabilities
 * introduced in v1.4.
 * 
 * Run this script with: node examples/test-project-templates.js
 */

// Import our Things client
import { ThingsClient } from '../src/things-client.js';

/**
 * Main test function
 * 
 * This function demonstrates project template creation with various
 * predefined templates and custom configurations.
 */
async function testProjectTemplates() {
  console.log('Testing Things project template functionality...\n');

  try {
    // Create a ThingsClient instance
    const client = new ThingsClient();

    // Check if we're in the right environment
    if (!client.isThingsAvailable()) {
      throw new Error('Things app is not available. Make sure you\'re running on macOS.');
    }

    // Check for authentication token
    if (!process.env.THINGS_AUTHENTICATION_TOKEN) {
      console.warn('Warning: THINGS_AUTHENTICATION_TOKEN not set. Project creation requires authentication.');
      console.warn('Please set this environment variable to test template functionality.\n');
      return;
    }

    console.log('Testing Project Templates:');
    console.log('=' .repeat(40));

    // Test cases for different project templates
    const templateTests = [
      {
        name: 'Software Project Template',
        data: {
          title: 'New Web App Development',
          template_name: 'software_project',
          project_notes: 'Building a new web application with modern stack',
          area: 'Development',
          tags: 'web, javascript, project',
          when: 'today'
        }
      },
      {
        name: 'Marketing Campaign Template',
        data: {
          title: 'Q4 Product Launch Campaign',
          template_name: 'marketing_campaign',
          project_notes: 'Comprehensive marketing campaign for new product launch',
          area: 'Marketing',
          tags: 'campaign, launch, q4',
          when: 'anytime',
          deadline: '2024-12-31'
        }
      },
      {
        name: 'Event Planning Template',
        data: {
          title: 'Annual Company Conference',
          template_name: 'event_planning',
          project_notes: 'Planning the annual company conference for 2024',
          area: 'Events',
          tags: 'conference, annual, planning',
          when: 'someday'
        }
      },
      {
        name: 'Research Project Template',
        data: {
          title: 'Market Research Study',
          template_name: 'research_project',
          project_notes: 'Research study on market trends and opportunities',
          area: 'Research',
          tags: 'research, market, analysis',
          when: 'tomorrow'
        }
      },
      {
        name: 'Custom Template',
        data: {
          title: 'Custom Project with Specific Tasks',
          template_name: 'custom',
          project_notes: 'A custom project with specific task requirements',
          area: 'Personal',
          tags: 'custom, personal',
          custom_todos: [
            {
              title: 'Custom Task 1',
              notes: 'First custom task',
              tags: 'important'
            },
            {
              title: 'Custom Task 2', 
              notes: 'Second custom task',
              when: 'today'
            },
            {
              title: 'Custom Task 3',
              notes: 'Third custom task'
            }
          ]
        }
      }
    ];

    for (const test of templateTests) {
      try {
        console.log(`\n${test.name}:`);
        console.log(`Project Title: "${test.data.title}"`);
        console.log(`Template: ${test.data.template_name}`);
        
        // Show additional configuration
        if (test.data.area) console.log(`Area: ${test.data.area}`);
        if (test.data.tags) console.log(`Tags: ${test.data.tags}`);
        if (test.data.when) console.log(`Scheduled: ${test.data.when}`);
        if (test.data.deadline) console.log(`Deadline: ${test.data.deadline}`);
        if (test.data.custom_todos) console.log(`Custom todos: ${test.data.custom_todos.length} items`);
        
        // Simulate project template creation
        // In a real implementation, this would call the actual template creation function
        const projectData = {
          title: test.data.title,
          notes: test.data.project_notes,
          area: test.data.area,
          tags: test.data.tags,
          when: test.data.when,
          deadline: test.data.deadline,
          todos: getTemplateTodos(test.data.template_name, test.data.custom_todos)
        };
        
        const success = await client.addProject(projectData);
        
        if (success) {
          console.log(`✅ SUCCESS: Project created from ${test.data.template_name} template`);
          console.log(`   Created with ${projectData.todos.length} to-do items`);
        } else {
          console.log(`❌ FAILED: Project template creation failed`);
        }
        
        // Delay between project creations
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ ERROR: ${test.name} failed - ${error.message}`);
      }
    }

    console.log('\n' + '=' .repeat(40));
    console.log('Project template testing completed!');
    console.log('Check your Things app to see the created projects with their template-based tasks.');

  } catch (error) {
    console.error('❌ ERROR during project template test:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure Things app is installed and running on macOS');
    console.error('2. Set THINGS_AUTHENTICATION_TOKEN environment variable');
    console.error('3. Ensure you have permission to create projects in Things');
  }
}

/**
 * Get template todos based on template name
 * This simulates the template selection logic
 */
function getTemplateTodos(templateName, customTodos = null) {
  switch (templateName) {
    case 'software_project':
      return [
        'Project planning and requirements gathering',
        'Set up development environment',
        'Create initial architecture and design',
        'Implement core functionality',
        'Write unit tests',
        'Integration testing',
        'Documentation and README',
        'Code review and refactoring',
        'Deployment and release preparation',
        'Post-launch monitoring and feedback'
      ];
      
    case 'marketing_campaign':
      return [
        'Define campaign objectives and KPIs',
        'Research target audience and competitors',
        'Develop campaign messaging and positioning',
        'Create content calendar and timeline',
        'Design marketing materials and assets',
        'Set up tracking and analytics',
        'Launch campaign across channels',
        'Monitor campaign performance',
        'Analyze results and optimize',
        'Prepare campaign report and learnings'
      ];
      
    case 'event_planning':
      return [
        'Define event goals and success metrics',
        'Set budget and get approvals',
        'Choose venue and book date',
        'Create event timeline and schedule',
        'Invite speakers and plan agenda',
        'Set up registration and ticketing',
        'Plan catering and logistics',
        'Create marketing and promotional materials',
        'Coordinate day-of-event logistics',
        'Post-event follow-up and feedback collection'
      ];
      
    case 'research_project':
      return [
        'Define research questions and hypotheses',
        'Literature review and background research',
        'Design research methodology',
        'Gather and organize data sources',
        'Conduct primary research and data collection',
        'Analyze data and identify patterns',
        'Draw conclusions and validate findings',
        'Write research report or paper',
        'Peer review and feedback incorporation',
        'Present findings and publish results'
      ];
      
    case 'custom':
      if (customTodos && Array.isArray(customTodos)) {
        return customTodos.map(todo => 
          typeof todo === 'string' ? todo : todo.title
        );
      } else {
        return ['Define project scope and objectives', 'Create project plan', 'Execute project tasks', 'Review and finalize project'];
      }
      
    default:
      return ['Project setup', 'Main tasks', 'Review and completion'];
  }
}

// Run the test
testProjectTemplates();