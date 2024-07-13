import { Module } from "@nestjs/common";
import { SolverScheduler } from "./scheduler/solver.scheduler";
import { SolverService } from "./service/solver.service";

@Module({
  providers: [SolverScheduler, SolverService],
})
export class SolverModule {}
