
export interface Iuser {
    id: number;
    username: string;
    email: string;
    phone: string;
    address: string;
    role: "admin" | "client";
    password?: string; 
    isLocked?: boolean; // Trạng thái khóa
    lockUntil?: string | null; // Thời điểm hết khóa (ISO date string)
    isDeleted?: boolean; // Đánh dấu user đã bị xoá mềm
  }

  export type IuserForm = Omit<Iuser, "id">;