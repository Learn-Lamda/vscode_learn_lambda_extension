import { HttpRepository } from "../../core/repository/http_repository";
import { VMContext } from "./vm_context";

export class RunOnCurrentFileHttpRepository extends HttpRepository {
  runVm = (code: string) =>
    this.jsonRequest<{ value: VMContext[] }>("/vm", "POST", {
      code: code,
      token: "123",
      taskId: "3123",
    });
}
