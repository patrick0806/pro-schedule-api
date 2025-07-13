import { hash, compare } from 'bcrypt';

export async function generateHash(str: string): Promise<string> {
    return hash(str, 10);
}

export async function compareHash(str: string, hash: string): Promise<boolean> {
    return compare(str, hash);
}
