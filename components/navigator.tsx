import { useRouter } from 'next/router'
import { useCallback, useState } from "react";
import styled from 'styled-components';
import { Options } from '../lib/withSession';
import { Qparams } from '../lib/qparams';
import useSWR, { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable'
import { fetchMyNewsline, fetchPublications, fetchPublicationCategories } from '../lib/lakeApi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NextImage from 'next/image';
import StyledCheckbox from './checkbox';

const Row = styled.div`
    display:flex;
    padding-left:6px;
    padding-right:16px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0px;
    position:relative;
`
const Left = styled.div`
    display:flex;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
    padding: 0px;
    position:relative;
`
const PubImageBox = styled.div`
    position: relative;
    object-fit: cover;
    margin-top: 10px;
    padding-top: 0px;
    margin-right: 16px;
    margin-left:16px;
   
    margin-bottom: 10px;
    height:28px;
    width:28px;  
`

const Name = styled.div`
    margin-right:16px;
`
const TabsWrap = styled.div`
    font-size:14px;
`
const Hr = styled.hr`
   
    margin:16px;
    font-size:14px;
`
const FilterWrap = styled.div`
    margin-left:16px;
`

const Check = ({ label, checked, onChange, disabled }: { label?: string, checked: boolean, onChange: any, disabled: boolean }) => {
    return <StyledCheckbox
        onClick={() => onChange(!checked)}
    >
        <input
            type="checkbox"
            name={'switch'}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
        />
        <label htmlFor={label}></label>
    </StyledCheckbox>
}


const Navigator = ({ session, qparams }: { session: Options, qparams: Qparams }) => {
    const router = useRouter();
    let { newsline, navTab } = qparams;
    const { sessionid, userslug } = session;


    console.log("Navigator, navTab=", navTab, router.query)
    if (router.query) {
        const ssr = router.query.ssr;
        if (ssr) {
            const type = ssr[1];
            navTab = +(((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1);
        }
    }

    console.log("Navigator2, navTab=", navTab)

    return <TabsWrap><Tabs selectedIndex={navTab} onSelect={(i) => {
        console.log("select ", i)
        router.push(`/${qparams.forum}/${qparams.type}/${qparams.layoutNumber}/${i}`, `/${qparams.forum}/${qparams.type}/${qparams.layoutNumber}/${i}`, { shallow: true })
    }}>
        <TabList>
            <Tab>Explore Publications</Tab>
            <Tab>My Newsline</Tab>
        </TabList>
        <TabPanel>
            <Publications session={session} qparams={qparams} />
        </TabPanel>

        <TabPanel>
            <MyNewsline session={session} qparams={qparams} />
        </TabPanel>
    </Tabs></TabsWrap>
};
interface Publication {
    name: string;
    switch: string;
    icon: string
}
const MyNewsline = ({ session, qparams }: { session: Options, qparams: Qparams }) => {
    const { newsline } = qparams;
    const { sessionid, userslug } = session;

    const { data: myNewsline, error: myNewslineError } = useSWR(['navigator', newsline, sessionid, userslug], fetchMyNewsline);
    return <>{myNewsline ? myNewsline.map((n: Publication) => <>
        <Row><Left><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={n.icon} alt={n.name} fill={true} /></PubImageBox>
            <Name>{n.name}</Name></Left>
            <Check checked={n.switch == 'on'} onChange={() => { }} disabled={false} />
        </Row>
    </>) : "Loading..."}</>
}
interface FiltersArray {
    [key: string]: string;
}

const Publications = ({ session, qparams }: { session: Options, qparams: Qparams }) => {

     const { mutate } = useSWRConfig()
    const { newsline } = qparams;
    const { sessionid, userslug } = session;
    const { data: publicationCategories, error: publicationCategoriesError }: { data: FilterDatum[], error: string | undefined } = useSWRImmutable(['publicationCategories', newsline], fetchPublicationCategories);

  
    const [filters, setFilters]: [filters: FiltersArray, setFilters: any] = useState(()=>publicationCategories?.reduce((accum, currentVal) => {
       
        accum[currentVal.tag] = 'on';
        console.log("reduce:",currentVal,accum)
        return accum;
    },[]
    )||[]);

    // const out = filterValues(filters);
    //console.log("out", out)
    console.log("filters",filters)
    const { data: publications, error: publicationsError } = useSWR(['publications', newsline, sessionid, userslug, filters], fetchPublications, {

        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    console.log("Publications render, key=",['publications', newsline, sessionid, userslug, filters], publications)
    const setF = useCallback((tag: string, action: string, doFetch: boolean) => {
        console.log("Publications callback", tag, action)
        //if (action) {
            let newFilters={...filters}
        if (filters[tag] != action) {

            newFilters[tag] = action;

            if (doFetch) {
                //  setTimeout(() => {
                //const out = filterValues(filters);
                console.log("call mutate=>", filters)
                mutate(['publications', newsline, sessionid, userslug, filters], undefined,
                    { revalidate: true });
                console.log("after mutate") 
                // }, 1);
            }
            setFilters(newFilters);
        }
        //}
    }, [filters, mutate, sessionid, userslug, newsline])
    //  const { data:publicationCategories, error: publicationCategoriesError } = useSWR(['publicationCategories', newsline], fetchPublicationCategories);
    //  console.log("publicationCategories",publicationCategories)

    console.log("render publications", publications)
    return <><Hr /><Row>
        <FilterWrap> <Filters newsline={newsline} callback={setF} publicationCategories={publicationCategories} /></FilterWrap>
    </Row><Hr />
        {publications ? publications.map((n: Publication) => <Row key={`afpqhqpd-${n.name}`}><Left><PubImageBox><NextImage placeholder={"blur"} blurDataURL={'https://qwiket.com/static/css/afnLogo.png'} src={n.icon} alt={n.name} fill={true} /></PubImageBox>
            <Name>{n.name}</Name></Left>
            <Check checked={n.switch == 'on'} onChange={() => { }} disabled={false} />
        </Row>
        ) : "Loading..."}{publicationsError}</>
}
interface FilterDatum {
    name: string;
    tag: string;

}
const Filters = ({ newsline, callback, publicationCategories }: { newsline: string, callback: any, publicationCategories: any }) => {



    console.log("publicationCategories-->", publicationCategories)
    return <><Row>{publicationCategories ? publicationCategories.map(f => <Filter key={`wwfvpvh-${f.name}`} name={f.name} tag={f.tag} callback={callback}></Filter>) : 'Loading...'}</Row></>
}
const Filter = ({ name, tag, callback }: { name: string, tag: string, callback: any }) => {
    const [checked, setChecked] = useState(true);
    callback(tag, checked?'on':'off', false);
    return <Row>{name}  <Check checked={checked} onChange={(c: boolean) => { setChecked(c); callback(tag, c?'on':'off', true) }} disabled={false} /></Row>
}

export default Navigator;
