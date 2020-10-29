import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
    }),
  }
  app.get('/api/fetch2022Schedule', validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);

    if (!(competition)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (competition) was not provided');
    } else {
      val.data = await dbHandler.fetch2022Schedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        data: val.data.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
