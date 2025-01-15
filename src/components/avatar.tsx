import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage
        src="https://scontent.fphl1-1.fna.fbcdn.net/v/t39.30808-6/274184723_4931629970259964_6025379938276736971_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=fXkaxxf3MVQQ7kNvgH9_HA9&_nc_zt=23&_nc_ht=scontent.fphl1-1.fna&_nc_gid=Ae-jLBb6xK1-TkWM9X23-wo&oh=00_AYDrPTQbfF-Vm-KU5QTClk4_mFgvuHZ3joXt-0TLlX8jUg&oe=6785DEE5"
        alt="@shadcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
