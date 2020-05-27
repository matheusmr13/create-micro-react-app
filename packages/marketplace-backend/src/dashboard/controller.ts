import { Request, Response } from 'express';

class DashboardController {
  public getDashboard = async (req: Request, res: Response) => {
    res.json({
      applicationCount: 1,
      microfrontendCount: 5,
    });
  };
}

export default new DashboardController();
