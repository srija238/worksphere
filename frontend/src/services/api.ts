export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    return response.json() as Promise<T>;
  },
};
