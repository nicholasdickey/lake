import styled from 'styled-components';
import useSWR from 'swr';
import { Options } from '../lib/withSession';
import Qwiket from './qwikets/qwiket';
import { useAppContext } from '../lib/context';
import { fetchTopic } from '../lib/lakeApi'

const Topic = () => {
  const { session, qparams } = useAppContext();
  const key: [u: string, threadid: string, withBody: number] = ['topic', qparams.threadid, 1];
  const { data, error } = useSWR(key, fetchTopic);
  if (!data) {
    const item = {
      image: 'https://media.istockphoto.com/id/1280015859/photo/blue-lake-with-treeline-in-autumn-color-on-a-sunny-afternoon-in-northern-minnesota.jpg?s=612x612&w=0&k=20&c=smtj8bw1BW3gUI9rrxRnAzQKGWmTyMQYcODgbuWNMbc=',
      title: 'Loading...',
      site_name: 'America First News',
      description: "Loading...",
      slug: 'loading'

    }
    return <Qwiket extraWide={false} item={item} isTopic={true}></Qwiket>
  }
  return <Qwiket extraWide={false} item={data?.item} isTopic={true}></Qwiket>
}
export default Topic;