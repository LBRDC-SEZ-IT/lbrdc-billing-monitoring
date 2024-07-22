import { cn } from "@/lib/utils";
import { Icons } from "./icons";

interface Props {
  className?: string;
}

const Loader = ({ className, ...props }: Props) => {
  return (
    <div className={cn(className, "flex justify-center items-center gap-2 py-24")} {...props}>
      <Icons.loader className="animate-spin min-w-5 min-h-5 size-5" />
      Fetching group information, please wait ...
    </div>
  );
};

export default Loader;
