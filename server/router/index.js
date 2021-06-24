import combineRouter from 'koa-combine-routers'
import scriptRouter from './script_tag'

const router = combineRouter(
    scriptRouter
);
export default router;