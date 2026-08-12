export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

class Success<T, E> {
    public readonly isSuccess = true as const;
    public readonly isFailure = false as const;
    public readonly error = null;
    private readonly _value: T;

    constructor(value: T) {
        this._value = value;
    }

    public getValue(): T {
        return this._value;
    }
}

class Failure<T, E> {
    public readonly isSuccess = false as const;
    public readonly isFailure = true as const;
    public readonly error: E;

    constructor(error: E) {
        this.error = error;
    }

    public getValue(): T {
        throw new Error("Can't get value from failure result");
    }
}

export const Result = {
    ok<T, E = Error>(value: T): Result<T, E> {
        return new Success(value);
    },

    fail<T, E = Error>(error: E): Result<T, E> {
        return new Failure(error);
    },

    failWithMessage(message: string): Result<never, Error> {
        return new Failure(new Error(message));
    },
};
