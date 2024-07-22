import { cn } from "@/lib/utils";
import { Icons } from "./icons";

interface Props {
  className?: string;
}

const NoData = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(className, "flex flex-col justify-center items-center gap-2 py-6")}
      {...props}>
      <Icons.illustration.noData2
        strokeWidth={1}
        className="size-24 text-muted-foreground mb-5 bg-background rounded-full p-5 border-2 border-dashed"
      />
      <span className="font-semibold mb-1">Oops! Something went wrong</span>
      <span className="max-w-sm text-muted-foreground text-pretty text-center text-sm">
        There seems to be a problem getting the required information.
      </span>
    </div>
  );
};

export default NoData;
