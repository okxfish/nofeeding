import { default as Mock, Random}  from 'mockjs';

export default Mock.mock(():any=>{
  const groupCount:number= Random.integer(3, 2);
  let feedCount = 0;
  return Array.from({length: groupCount}).map(
    (item, index):any=>({
      id: index,
      name: Random.title(1),
      children: Array.from({length: Random.integer(4, 10)}).map(
        ():any=>{
          feedCount = feedCount + 1;
          return ({
            id: feedCount,
            title: Random.title(1),
            summary: Random.sentence(1, 10),
            thumbnailSrc: Random.image('100x100'),
            sourceName: Random.title(1, 2),
            sourceID: "",
            time: Random.date(),
            isRead: Random.boolean(),
            isStar: Random.boolean(),
            isPin: Random.boolean(),
          })
        }
      ),
    })
  )
})