/* eslint-disable max-classes-per-file */
export class ErrorUnauthorized extends Error {
    public static readonly code = "auth/unauthorized";

    message = "Chưa đăng nhập!";
}

export class ErrorPermissionDenied extends Error {
    public static readonly code = "auth/permission";

    message = "Không có quyền!";
}

export class ErrorMissingAdministrative extends Error {
    public static readonly code = "auth/admin";

    message = "Thiếu quyền Quản lí.";
}

export class ErrorInvalidRoles extends Error {
    public static readonly code = "auth/role";

    message = "Bạn không có quyền để thực hiện thao tác này!";
}

export class ErrorMissingField extends Error {
    public static readonly code = "missing_field";

    constructor(fieldName: string) {
        super();
        this.message = `Thiếu ${fieldName}.`;
    }
}
