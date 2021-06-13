import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { normalize, NormalizedSchema } from "normalizr";
import { useInfiniteQuery, useQueryClient } from "react-query";
import api from "./api";
import { SystemStreamIDs } from "./api/inoreader";
import { article } from "./schema";
import { produce, current } from "immer";
import { get } from "lodash";

interface ArticleEntitySchema {
  article: {
    [key: string]: any;
  };
}

interface InfiniteNormalizedArticles
  extends NormalizedSchema<ArticleEntitySchema, string[]> {
  continuation: string;
}

const Test = () => {
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const streamId = qs.streamId;
  const unreadOnly = qs.unreadOnly;
  const queryClient = useQueryClient();
  const streamContentQueryKey = [
    "use/streamContentQuery",
    streamId,
    unreadOnly,
  ];

  // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
  const streamContentQuery = useInfiniteQuery<InfiniteNormalizedArticles>(
    streamContentQueryKey,
    async ({
      queryKey: [key, streamId = "", unreadOnly = "0"],
      pageParam = "",
    }): Promise<InfiniteNormalizedArticles> => {
      const exclude = unreadOnly ? SystemStreamIDs.READ : "";
      const res = await api.inoreader.getStreamContents(String(streamId), {
        exclude: exclude,
        continuation: pageParam,
      });
      const newNormalizedArticles = normalize<any, ArticleEntitySchema>(
        res.data.items,
        [article]
      );
      return {
        ...newNormalizedArticles,
        continuation: res.data.continuation,
      };
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.continuation;
      },
    }
  );

  const setArticleData = (id, updater) => {
    queryClient.setQueryData(
      streamContentQueryKey,
      produce((data) => {
        if (!data.pages) {
          return null
        }

        const pageResult = data.pages.find(page => {
          return id in page.entities.article
        })
        
        if (pageResult) {
          const article = pageResult.entities.article[id];
          updater(article);
        }
      })
    );
  };

  let allData: any[] = [];
  
  if (streamContentQuery.data) {
    allData = streamContentQuery.data.pages.map((pages, index) => {
      const {
        entities: { article },
        result,
      } = pages;
      return result.map((id) => ({
        ...article[id],
      }));
    }).reduce((acc, cur)=> [...acc, ...cur], []);
  }

  return (
    <div>
      <button onClick={() => streamContentQuery.fetchNextPage()}>
        refetch
      </button>
      <ul className="h-160 overflow-auto">
        {allData.map((item) => {
          const onClick = () => {
            setArticleData(item.id, (item) => {
              item.title = "fuck";
            });
          };
          return <li onClick={onClick}>{item.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default Test;
