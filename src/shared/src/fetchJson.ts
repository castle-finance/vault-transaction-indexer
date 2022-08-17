import * as request from "request";

// // // //

/**
 * fetchJson
 * Helper function to fetch JSON via REST API
 */
export function fetchJson<ResponseType = any>(
    url: string
): Promise<ResponseType> {
    // Wrap request in Promise<ResponseType>
    return new Promise<ResponseType>((resolve) => {
        request(url, {}, (error, resp) => {
            // Throw error to break into the try/catch/finally statement that will wrap this invocation in each lambda
            if (error) {
                throw new Error(error);
            }

            // Pull body from JSON resp
            const { body } = resp.toJSON();

            // Parse body JSON + coerce
            const response = JSON.parse(body) as unknown as ResponseType;

            // Pass raw TX via resolve
            return resolve(response);
        });
    });
}
