declare namespace JSX {
  interface IntrinsicElements {
    'chat-bot-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      src?: string;
      width?: string;
      height?: string;
    }, HTMLElement>;
  }
}