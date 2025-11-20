import { DEFAULT_EMPTY } from "@/app/constants/state";

interface DataRenderProps<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty?: {
    title: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

const DataRender = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRenderProps<T>) => {
  if (!success) return <h2>Something went wrongs!</h2>;
  if (!data || data.length === 0) return <h2>Something went wrongs!</h2>;
  return <div>{render(data)}</div>;
};

export default DataRender;
