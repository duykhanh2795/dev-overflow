import qs from "query-string";
export const formUrlQuery = ({
  params,
  key,
  value,
}: Record<string, string>) => {
  const queryString = qs.parse(params);

  queryString[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};
export const removUrlQueryKeys = ({
  params,
  keys,
}: {
  params: string;
  keys: string[];
}) => {
  const queryString = qs.parse(params);

  keys.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true, skipEmptyString: true },
  );
};
