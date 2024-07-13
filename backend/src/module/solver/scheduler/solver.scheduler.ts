import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { SolverService } from "../service/solver.service";

@Injectable()
export class SolverScheduler {
  constructor(private readonly ss: SolverService) {}

  @Cron("*/5 * * * * *")
  async solveOrders() {
    this.ss.solveOrders();
  }
}
