/**
 * getEnv
 * Pulls a string value from process.env and throws error when its missing
 */
export function getEnv(props: { key: string }): string {
    // Define reference to environment variable we need
    const value = process.env[props.key];

    // Ensure environment variable is present
    if (typeof value !== "string" || value === "") {
        throw new Error(`process.env.${props.key} must be present`);
    }

    // Log + return the value
    console.log(`env.${props.key}: ${value}`);
    return value;
}
