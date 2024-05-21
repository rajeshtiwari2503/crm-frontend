import Link from 'next/link';
import React from 'react';
import { Nav } from 'react-bootstrap';
 

function PageHeader (props) {
        const { pagetitle, righttitle, link, routebutton, modalbutton, button  } = props
        return (
            <div className="row align-items-center">
                <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent flex align-items-center px-0  justify-between border-b">
                        <div className="font-bold text-2xl mb-0">{pagetitle}</div>
                        {
                            routebutton ? <div className="col-auto d-flex w-sm-100">
                                <Link href={process.env.PUBLIC_URL+link} className="btn btn-primary btn-set-task w-sm-100"><i className="icofont-plus-circle me-2 fs-6"></i>{righttitle}</Link>
                            </div> : null
                        }
                        {
                            modalbutton ? modalbutton() : null
                        }
                        {
                            button ? <button type="submit" className="btn btn-primary btn-set-task w-sm-100 text-uppercase px-5">Save</button> : null

                        }
                        
                    
                    </div>
                </div>
            </div>
        )
    }

export default PageHeader;