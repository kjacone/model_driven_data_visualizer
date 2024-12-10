import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient()
  .$extends(withAccelerate());

async function main() {
  // Create a new user with Google auth
  const user1Email = `alice${Date.now()}@gmail.com`;
  const user1 = await prisma.user.create({
    data: {
      email: user1Email,
      name: 'Alice Developer',
      googleId: 'google123',
      tokenUsage: {
        create: {
          used: 0,
          total: 10000,
        },
      },
      projects: {
        create: {
          name: 'First Webcontainer',
          status: 'DRAFT',
          runtime: 'nodejs',
          version: '16.x',
          lastDeployed: new Date(),
          actions: {
            create: {
              type: 'CREATE',
              description: 'Initial project creation',
              createdAt: new Date(),
            }
          },
          history: {
            create: {
              event: 'Project created',
              metadata: {
                initialConfig: {
                  runtime: 'nodejs'
                }
              },
              createdAt: new Date(),

            }
          }
        }
      }
    },
    include: {
      projects: {
        include: {
          actions: true,
          history: true
        }
      }
    }
  });

 // Create a new user with Google auth
const user2Email = `bob${Date.now()}@gmail.com`;
const user2 = await prisma.user.create({
  data: {
    email: user2Email,
    name: 'Bob Developer',
    googleId: 'google789',
    projects: {
      create: {
        name: 'Second Webcontainer',
        status: 'RUNNING',
        runtime: 'python',
        version: '3.9',
        lastDeployed: new Date(),
        actions: {
          create: {
            type: 'DEPLOY',
            description: 'Deployed new version',
            createdAt: new Date(),
          }
        },
        history: {
          create: {
            event: 'Deployed new version',
            metadata: {
              newVersion: '1.0.1'
            },
            createdAt: new Date()
          }
        }
      }
    }
  },
  include: {
    projects: {
      include: {
        actions: true,
        history: true
      }
    }
  }
});

// Create a new user with GitHub auth
const user3Email = `charlie${Date.now()}@github.com`;
const user3 = await prisma.user.create({
  data: {
    email: user3Email,
    name: 'Charlie Engineer',
    githubId: 'github789',
    projects: {
      create: {
        name: 'Third Webcontainer',
        status: 'BUILDING',
        runtime: 'ruby',
        version: '2.7',
        lastDeployed: new Date(),
        actions: {
          create: {
            type: 'CREATE',
            description: 'Initial project creation',
            createdAt: new Date(),
          }
        },
        history: {
          create: {
            event: 'Project created',
            metadata: {
              initialConfig: {
                runtime: 'ruby'
              }
            },
            createdAt: new Date(),
          }
        }
      }
    }
  },
  include: {
    projects: {
      include: {
        actions: true,
        history: true
      }
    }
  }
});

  // Retrieve all running projects
  const runningProjects = await prisma.project.findMany({
    where: { status: 'RUNNING' },
    include: {
      user: true,
      actions: true
    }
  });
  console.log(`Retrieved all running projects: ${JSON.stringify(runningProjects)}`);

  // Create a new project for existing user
  const newProject = await prisma.project.create({
    data: {
      name: 'React Development Environment',
      runtime: 'nodejs',
      version: '18.x',
      lastDeployed: new Date(),
      createdAt: new Date(),
      status: 'DRAFT',
      user: {
        connect: {
          email: user1Email
        }
      },
      actions: {
        create: {
          type: 'CREATE',
          description: 'Project initialized'
        }
      },
      history: {
        create: {
          event: 'Project created',
          metadata: {
            initialConfig: {
              runtime: 'nodejs'
            }
          }
        }
      }
    },
    include: {
      actions: true,
      history: true
    }
  });
  console.log(`Created a new project: ${JSON.stringify(newProject)}`);

  // Update project status
  const updatedProject = await prisma.project.update({
    where: {
      id: newProject.id
    },
    data: {
      status: 'RUNNING',
      actions: {
        create: {
          type: 'START',
          description: 'Project started'
        }
      },
      history: {
        create: {
          event: 'Project status updated',
          metadata: {
            previousStatus: 'DRAFT',
            newStatus: 'RUNNING'
          }
        }
      }
    },
    include: {
      actions: true,
      history: true
    }
  });
  console.log(`Updated project status: ${JSON.stringify(updatedProject)}`);

  // Retrieve all projects by user with their actions and history
  const projectsByUser = await prisma.project.findMany({
    where: {
      user: {
        email: user1Email
      }
    },
    include: {
      actions: true,
      history: true
    }
  });
  console.log(`Retrieved all projects from a specific user: ${JSON.stringify(projectsByUser)}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });