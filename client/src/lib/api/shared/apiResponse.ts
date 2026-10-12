// api/apiResponse

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  code?: string;
  message?: string;
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message ? data.message : "Request failed.",
    );
  }

  if (!("data" in data)) {
    throw new Error("Invalid API response.");
  }

  return data.data;
};
