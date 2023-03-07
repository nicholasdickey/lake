import { useRouter } from 'next/router'
import { useCallback, useState } from "react";
import styled from 'styled-components';
import { Options } from '../../lib/with-session';
import { Qparams } from '../../lib/qparams';
import Link from 'next/link'
import useSWR, { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable'
import { fetchMyNewsline, fetchPublications, fetchPublicationCategories, updateMyNewsline, updatePublications, fetchPublicationsKey, fetchMyNewslineKey, Filters } from '../../lib/lake-api';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NextImage from 'next/image';
import StyledCheckbox from '../widgets/checkbox';
import SearchField from '../widgets/searchField';
import axios from 'axios';

const Row = styled.div`
    display:flex;
    padding-left:6px;
    padding-right:6px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
   // padding: 0px;
    position:relative;
    
`
const FilterRow = styled.div`
    display:flex;
    padding-left:16px;
    //padding-right:4px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    //padding: 0px;
    height:26px;
   // position:relative;
`
const PublicationRow = styled.div`
    display:flex;
    //padding-left:16px;
    padding-right:6px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    //padding: 0px;
    //height:48px;
   // position:relative;
`
const Description = styled.div`
    display:flex;
    padding-left:16px;
    font-size: 11px;
    align-items: center;
    justify-content: space-between;
    //flex-wrap: wrap;
    color:var(--highlight);
    //height:34px;
    margin-top:4px;
    padding-right:16px;
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
interface Dense{
    dense:boolean;
}
const Name = styled.div<Dense>`
    margin-right:16px;
    color:var(--highlight);
    name:34px;
    font-size:${({dense})=>dense?9:12}px;
    @media(max-width:1199px){
        font-size:9px;
        margin-right:0px;
    }
    @media(min-width:1800px){
        font-size:14px;
    }
`
const Highlight = styled.div`
    color:var(--text);
`
const TabsWrap = styled.div`
    font-size:12px;
    margin-top:-1px;
    .selected-tab{
        border-width:1px;
        border-color:var(--text);
    }
      
`
const Hr = styled.hr`
    
    margin:16px ;
    font-size:14px;
  
`
const VerticalSpacer = styled.div`
    
    margin:16px ;
    font-size:14px;
  
`
const FilterWrap = styled.div`
    //margin-left:16px;
`
const SearchBox = styled.div`
    display:flex;
    //padding-left:6px;
    //padding-right:16px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    //width: 100%;
    margin-top: 16px;
    position:relative;
    background:var(--background);
    .react-search-field-input{
        color:var(--text);
        background:var(--background);
    }
    .react-search-field-button-ignore{
        color:var(--text);
        //border-color:${props => props.color};
        background-color:var(--background);
    }
`
const PublicationWrap=styled.div`
    margin-bottom:16px;
`

const Check = ({ label, checked, onChange, disabled }: { label?: string, checked: boolean, onChange: any, disabled: boolean }) => {
    return <StyledCheckbox
        onClick={() => onChange(!checked)}
        label={''}
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


const Navigator = ({ session, qparams, updateSession }: { session: Options, qparams: Qparams, updateSession: any }) => {
    const router = useRouter();
    let { newsline, navTab } = qparams;


    //console.log("Navigator, navTab=", navTab, router.query)
    if (router.query) {
        const ssr = router.query.ssr;
        if (ssr) {
            const type = ssr[1];
            navTab = +(((type == 'newsline') ? ssr[3] : type == "solo" ? ssr[4] : 0) || 1);
        }
    }

    //console.log("Navigator2, navTab=", navTab)

    return <TabsWrap><Tabs focusTabOnClick={false} defaultFocus={false} selectedTabClassName="selected-tab" defaultIndex={+(navTab || 1)} onSelect={(i) => {
        console.log("select ", i)
        router.push(`/${qparams.forum}/${qparams.type}/${qparams.layoutNumber}/${i}`, `/${qparams.forum}/${qparams.type}/${qparams.layoutNumber}/${i}`, { shallow: true })
    }}>
        <TabList>
            <Tab>Explore Publications</Tab>
            <Tab>My Newsline</Tab>
        </TabList>
        <TabPanel key="sdsdlkj1">
            <Publications session={session} qparams={qparams} updateSession={updateSession} />
        </TabPanel>

        <TabPanel key="sdsdlkj2">
            <MyNewsline session={session} qparams={qparams} updateSession={updateSession} />
        </TabPanel>
    </Tabs></TabsWrap>
};


interface Publication {
    name: string;
    switch: string;
    icon: string,
    tag: string;
    default: boolean;
    description: string
}
const MyNewsline = ({ session, qparams, updateSession }: { session: Options, qparams: Qparams, updateSession: any }) => {
    const { newsline } = qparams;
    let { sessionid, userslug, hasNewslines } = session;
    //sessionid=hasNewslines?sessionid:'';
    const key: fetchMyNewslineKey = ['navigator', newsline, sessionid, userslug, hasNewslines];
    const { data: myNewsline, error: myNewslineError, mutate } = useSWR(key, fetchMyNewsline);
    //console.log("MyNewsline", myNewsline);

    return <><VerticalSpacer />{myNewsline ? myNewsline.map((n: Publication) => <>
        <PublicationRow key={`afkkqkqqqq-${n.tag}`}>
            <Link href={`/${qparams.forum}/solo/${n.tag}/${qparams.layoutNumber}/${qparams.navTab}`}><Left>
                <PubImageBox>
                    <NextImage placeholder={"blur"} blurDataURL={'https://ucarecdn.com/d26e44d9-5ca8-4823-9450-47a60e3287c6/al90.png'} src={n.icon} alt={n.name} fill={true} />
                </PubImageBox>
                <Name dense={session.dense==1}>{!n.default ? <Highlight>{n.name}</Highlight> : <>{n.name}</>}</Name>
            </Left></Link>
            <Check checked={n.switch == 'on'} onChange={async (s: boolean) => {
               // console.log("onChange check")
                updateSession({ hasNewslines: true });
                mutate(updateMyNewsline({ tag: n.tag, switch: s ? 'on' : 'off', newsline, sessionid, userslug: session.userslug }),
                    {
                        optimisticData: myNewsline.map((p: Publication) => {
                            if (p.tag == n.tag) {
                               // console.log("check Optimistic update ", p.tag, s ? 'on' : 'off')
                                return {
                                    ...p,
                                    switch: s ? 'on' : 'off'
                                }
                            }
                            else {
                                return p;
                            }
                        })

                    })
            }} disabled={false} />
        </PublicationRow>

    </>) : "Loading..."}</>
}

const Publications = ({ session, qparams, updateSession }: { session: Options, qparams: Qparams, updateSession: any }) => {

    const { mutate } = useSWRConfig()
    const { newsline } = qparams;
    let { sessionid, userslug, hasNewslines } = session;
    //sessionid//=hasNewslines?sessionid:'';
    const [q, setQ] = useState("");

    const { data: publicationCategories, error: publicationCategoriesError }: { data: FilterDatum[], error: string | undefined } = useSWRImmutable(['publicationCategories', newsline], fetchPublicationCategories);


    const [filters, setFilters]: [filters: Filters, setFilters: any] = useState(() => publicationCategories ? publicationCategories.reduce((accum: Filters, currentVal) => {

        accum[currentVal.tag] = true;
        console.log("reduce:", currentVal, accum)
        return accum;
    }, {}) : {});
 //   console.log("RENDER PUBLICATIONS", session)
    // const out = filterValues(filters);
    //console.log("out", out)
  //  console.log("filters", filters)
    const key: fetchPublicationsKey = ['publications', newsline, sessionid, userslug, filters, q, hasNewslines];
    const { data: publications, error: publicationsError, mutate: mutatePublications } = useSWR(key, fetchPublications, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
   // console.log("Publications render, key=", key, publications)
    const setF = useCallback((tag: string, action: boolean, doFetch: boolean) => {
        //console.log("Publications callback", tag, action)
        //if (action) {
        let newFilters = { ...filters }
        if (filters[tag] != action) {

            newFilters[tag] = action;

            if (doFetch) {
                //  setTimeout(() => {
                //const out = filterValues(filters);
                // console.log("call mutate=>", filters);
                const key: fetchPublicationsKey = ['publications', newsline, sessionid, userslug, filters, q, hasNewslines];
                mutate(key, undefined, { revalidate: true });
                // console.log("after mutate")
                // }, 1);
            }
            setFilters(newFilters);
        }
        //}
    }, [filters, mutate, sessionid, userslug, newsline, q, hasNewslines])
    //  const { data:publicationCategories, error: publicationCategoriesError } = useSWR(['publicationCategories', newsline], fetchPublicationCategories);
    //  console.log("publicationCategories",publicationCategories)

 //   console.log("render publications", publications)
    return <><SearchBox ><SearchField
        placeholder="Search..."
        onSearchClick={(t: string) => { setQ(t); }}
        searchText="" classNames={undefined} disabled={undefined} onChange={undefined} onEnter={undefined} onBlur={undefined} //artifact of using a legacy jsx component
        theme={undefined} /></SearchBox><Hr /><Row>
            <FilterWrap> <FiltersContainer newsline={newsline} callback={setF} publicationCategories={publicationCategories} /></FilterWrap>
        </Row><Hr />
        {publications ? publications.map((n: Publication) => <PublicationWrap><PublicationRow key={`afpqhqpd-${n.name}`}>
        <Link href={`/${qparams.forum}/solo/${n.tag}/${qparams.layoutNumber}/${qparams.navTab}`}><Left>
                <PubImageBox>
                    <NextImage placeholder={"blur"} blurDataURL={'https://ucarecdn.com/d26e44d9-5ca8-4823-9450-47a60e3287c6/al90.png'} src={n.icon} alt={n.name} fill={true} />
                </PubImageBox>
                <Name dense={session.dense==1}><Highlight>{n.name}</Highlight></Name>
            </Left></Link>
            <Check checked={n.switch == 'on'} onChange={async (s: boolean) => {
              //  console.log("PUBLICATION ON CLICK callling mutate")
                //need to mutate session.hasNewslines
                updateSession({ hasNewslines: true });

                mutatePublications(updatePublications({ tag: n.tag, switch: s ? 'on' : 'off', newsline, filters, q, sessionid, userslug }),
                    {
                        optimisticData: publications.map((p: Publication) => {
                            if (p.tag == n.tag) {
                                return {
                                    ...p,
                                    switch: s ? 'on' : 'off'
                                }
                            }
                            else {
                                return p;
                            }
                        })

                    })
            }} disabled={false} />
        </PublicationRow>
            <Description>{n.description}</Description></PublicationWrap>
        ) : "Loading..."}{publicationsError}</>
}
interface FilterDatum {
    name: string;
    tag: string;

}
const FiltersContainer = ({ newsline, callback, publicationCategories }: { newsline: string, callback: any, publicationCategories: any }) => {
   // console.log("publicationCategories-->", publicationCategories)
    return <Left>{publicationCategories ? publicationCategories.map((f: FilterDatum) => <Filter key={`wwfvpvh-${f.name}`} name={f.name} tag={f.tag} callback={callback}></Filter>) : 'Loading...'}</Left>
}
const Filter = ({ name, tag, callback }: { name: string, tag: string, callback: any }) => {
    const [checked, setChecked] = useState(true);
    callback(tag, checked ? true : false, false);
    return <FilterRow>{name}
        <Check checked={checked} onChange={(c: boolean) => { setChecked(c); callback(tag, c ? 'on' : 'off', true) }} disabled={false} />
    </FilterRow>
}

export default Navigator;
