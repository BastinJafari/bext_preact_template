import type Chrome from "@bpev/bext/types/chrome";
import browserAPI from "@bpev/bext";
import { getOptions } from "./utilities/storage_helpers.ts";

browserAPI.tabs.onUpdated.addListener(
  async (
    _tabId: number,
    _tabChangeInfo: Chrome.TabChangeInfo,
    { url }: Chrome.Tab,
  ) => {
    const options = await getOptions();

    if (options && url) {
      const headers = new Headers();

      if (options.enableImageCaptions) {
        headers.append("X-With-Generated-Alt", "true");
      }
      if (options.useStreamingMode) {
        headers.append("Accept", "text/event-stream");
      }
      if (options.cacheTimeout !== undefined) {
        headers.append("X-Cache-Tolerance", options.cacheTimeout.toString());
      }

      // Fetch content using r.jina.ai with appropriate headers
      fetch(`https://r.jina.ai/${url}`, { headers })
        .then((response) => response.text())
        .then((content) => {
          // Handle the content as needed
          console.log(content);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
);
