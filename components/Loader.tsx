type LoaderProps = {
  show: boolean;
};

export const Loader = ({ show }: LoaderProps) => {
  return show ? <div className="loader" /> : null;
};
