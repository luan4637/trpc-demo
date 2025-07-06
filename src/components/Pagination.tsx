import React from "react"
import Link from "next/link"

interface PaginationProps {
    link: string,
    params: URLSearchParams
    totalPage: number
}

export default class Pagination extends React.Component<PaginationProps>
{
    constructor(props: PaginationProps) {
        super(props);
    }

    render() {
        const curPage = this.props.params.get('page') ?? 1;
        this.props.params.delete('page');
        const hrefPage = this.props.params.toString();

        return (
            <div className="pagination-wrapper">
                <ul className="pagination">
                    {Array.apply(0, Array(this.props.totalPage)).map((v, i) => {
                        return (
                            <li key={i}>
                                {(curPage == (i + 1)) ?
                                    <span>{ (i + 1) }</span>
                                    : <Link href={`${this.props.link}?${(hrefPage != '' ? hrefPage + '&' : '')}page=${(i + 1)}`}>{ (i + 1) }</Link>
                                }
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}