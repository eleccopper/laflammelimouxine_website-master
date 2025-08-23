import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export default function Pagination({ currentPage, totalPages, onPageChange }) {

    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages && pageNumber !== currentPage) {
            onPageChange(pageNumber);
        }
    };

    return (
        <ul className="cs-pagination_box cs-center cs-white_color cs-mp0 cs-semi_bold">
            {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                    <Link
                        className={`cs-pagination_item cs-center ${currentPage === index + 1 ? 'active' : ''}`}
                        to="#"
                        onClick={() => changePage(index + 1)}
                    >
                        {index + 1}
                    </Link>
                </li>
            ))}
            <li>
                <Link
                    to="#"
                    className="cs-pagination_item cs-center"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Icon icon="akar-icons:chevron-right" />
                </Link>
            </li>
        </ul>
    );
}
