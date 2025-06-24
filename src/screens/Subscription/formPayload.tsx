import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { config } from '../../config'

import ImgOrVideoRenderer from '../../components/ImgOrVideoRenderer/ImgOrVideoRenderer';

export const getProductColumns = ({ onEdit }) => {
    return [
        {
            name: 'Customer Name',
            selector: row => <div><span className='tableProfileIcon'>
                <ImgOrVideoRenderer
                    src={row?.image ? row.image : config.CIRCLE_ICON}
                    className={"tableProfileIconImg"}
                    width={30}
                    height={30}
                    description={"Description of the image"}
                    videoStyles={{ background: "#000", borderRadius: "50%" }}
                />
            </span> <span className='productName'>{row.item}</span></div>
            ,
            sortable: false,
            width: "35%",
            wrap: true
        },
        {
            name: 'Mobile Number',
            selector: row => `${row.mobile}`,
            sortable: false,
            width: "20%",
        },
        {
            name: 'City',
            selector: row => row.city,
            sortable: false,
            width: "20%",
        },
        {
            name: 'Total Sales',
            selector: row => `₹${row.orderCount}`,
            sortable: true,
            width: "20%",
        },
        // {
        //     name: 'Total Sales',
        //     selector: row => row.salesCount,
        //     sortable: true,
        //     width: "10%",
        // },
        // {
        //     name: '',
        //     selector: row => <p>
        //         <a className="editTag" onClick={() => onEdit(row)}><FontAwesomeIcon icon={faEllipsisV} /></a>
        //     </p>,
        //     sortable: false,
        //     width: "5%"
        // },
    ]
};