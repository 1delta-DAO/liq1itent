import { Injectable } from "@nestjs/common";

@Injectable()
export class SolverService {
  async solveOrders() {
    console.log("Solve Orders");
  }
}
