import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthguard } from "../guards/jwt.guard";

export function Auth() {
    return applyDecorators(
        UseGuards(JwtAuthguard)
    )
}

// export function AdminG() {
//     return applyDecorators(
//         UseGuards(AdminGuard)
//     )
// }

// export function RootG() {
//     return applyDecorators(
//         UseGuards(RootGuard)
//     )
// }