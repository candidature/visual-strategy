import React from 'react';

import { IoBarChartSharp } from 'react-icons/io5';
import {MdAdd, MdQueryStats} from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';
import {DEFAULT_SETTINGS} from "./contants.js";

const links = [
    { text: 'Dashboard', path: './'+DEFAULT_SETTINGS.DEFAULT_INITIATIVE, icon: <FaWpforms /> },
    { text: 'Initiatives', path: 'initiatives', icon: <MdQueryStats /> },
    { text: 'add Initiative', path: 'addInitiative', icon: <MdAdd /> },
    { text: 'add Labels', path: 'addLabels', icon: <MdAdminPanelSettings /> },

    { text: 'stats', path: 'stats', icon: <IoBarChartSharp /> },
    { text: 'profile', path: 'profile', icon: <ImProfile /> },
    { text: 'admin', path: 'admin', icon: <MdAdminPanelSettings /> },
    //
];

export default links;
