import { CloseIcon, VideoPopoverIcon } from "@/components/icons";
import { useUser } from "@/features/account/hooks/useUser";
import {
  IconButton,
  type IconButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import type { ForgedBlockDefinition } from "@typebot.io/forge-repository/definitions";
import { onboardingVideos } from "../data";
import { useOnboardingDisclosure } from "../hooks/useOnboardingDisclosure";
import { YoutubeIframe } from "./YoutubeIframe";

type Props = {
  type: keyof typeof onboardingVideos;
  defaultIsOpen?: boolean;
  blockDef?: ForgedBlockDefinition;
  children: ({ onToggle }: { onToggle: () => void }) => JSX.Element;
};

const Root = ({ type, blockDef, children }: Props) => {
  const { user, updateUser } = useUser();
  const youtubeId =
    onboardingVideos[type]?.youtubeId ?? blockDef?.onboarding?.youtubeId;
  const { isOpen, onClose, onToggle } = useOnboardingDisclosure({
    key: type,
    updateUser,
    user,
    blockDef,
  });

  if (!youtubeId) return children({ onToggle });

  return (
    <Popover isOpen={isOpen} placement="right" isLazy>
      <PopoverTrigger>{children({ onToggle })}</PopoverTrigger>

      <PopoverContent aspectRatio="1.5" width="640px">
        <PopoverArrow />
        <PopoverBody h="full" p="5">
          <YoutubeIframe id={youtubeId} />
          <IconButton
            icon={<CloseIcon />}
            aria-label={"Close"}
            pos="absolute"
            top="-3"
            right="-3"
            colorScheme="blackAlpha"
            size="sm"
            rounded="full"
            onClick={onClose}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const TriggerIconButton = (props: Omit<IconButtonProps, "aria-label">) => (
  <IconButton
    size="sm"
    icon={<VideoPopoverIcon />}
    aria-label={"Open Bubbles help video"}
    variant="ghost"
    colorScheme="orange"
    {...props}
  />
);

export const VideoOnboardingPopover = {
  Root,
  TriggerIconButton,
};
