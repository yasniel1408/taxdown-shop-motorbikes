import { container } from './container';
import { CustomerHttpControllerAdapter } from '../adapters/in/http/CustomerHttpControllerAdapter';
import { Router } from 'express';
import { BaseRouter } from './base/BaseRouter';

export class CustomerRouter extends BaseRouter {
    private router: Router;
    private customerController: CustomerHttpControllerAdapter;

    constructor() {
        super();
        this.router = Router();
        this.customerController = container.resolve(CustomerHttpControllerAdapter);
        this.configureRoutes();
    }

    protected configureRoutes(): Router {
        this.router.get('/health', this.customerController.getHealth);
        
        this.router.route('/customers')
            .get(this.customerController.getAllCustomers)
            .post(this.customerController.createCustomer);

        this.router.route('/customers/:userId')
            .get(this.customerController.getCustomerById)
            .put(this.customerController.updateCustomer)
            .delete(this.customerController.deleteCustomer);

        this.router.post('/customers/:userId/credit', this.customerController.addCredit);

        return this.router;
    }

    public getRouter(): Router {
        return this.configureRoutes();
    }
}