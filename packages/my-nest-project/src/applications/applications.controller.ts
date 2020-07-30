import { Controller, Post, Body } from '@nestjs/common';


@Controller('applications')
export class ApplicationsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}



  ApplicationRouter.get('/:uuid', asyncRequestHandler(ApplicationController.read));
ApplicationRouter.put('/:uuid', asyncRequestHandler(ApplicationController.update));
ApplicationRouter.get('/', asyncRequestHandler(ApplicationController.list));
ApplicationRouter.post('/', asyncRequestHandler(ApplicationController.create));

ApplicationRouter.post('/:uuid/deploy', asyncRequestHandler(ApplicationController.deploy));
ApplicationRouter.post('/import', asyncRequestHandler(ApplicationController.import));


  public import = this.withContext(async (req: Request, res: Response, context) => {
    const user = await context.getUser();
    const repository = await getGithubRepository(req.body.repositoryName);
    const application = await Application.createInstance({
      integrationType: INTEGRATION_TYPE.GITHUB,
      integrationId: repository.full_name,
      ownerId: user.id,
      ...req.body,
    });
    res.json(application);
  });

public deploy = this.withContext(async (req: Request, res: Response, context) => {
  const application = await context.getInstance();
  const user = await UserExtra.findOne(application.ownerId);

  const applicationDeploy = new ApplicationDeploy(application, user!);
  await applicationDeploy.execute();

  // await Notification.sendBeforeDeploy(user, application);
  // const deploysToDo = await CompiledDeploy.mount(application, user);
  // await CompiledDeploy.deploy(application, user, deploysToDo);
  // await Notification.sendAfterDeploy(user, application, deploysToDo);

  res.json(application);
});

public create = this.withContext(async (req: Request, res: Response, context) => {
  const user = await context.getUser();
  const application = await Application.createInstance({
    ownerId: user.id,
    ...req.body,
  });
  res.json(application);
});
}
