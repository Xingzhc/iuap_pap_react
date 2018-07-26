/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React, {Component} from "react";
import 'core-js/es6/map';
import 'core-js/es6/set';
import logger from "redux-logger";
import { addLocaleData, IntlProvider } from 'react-intl';
import {Locale} from 'tinper-bee';
import mirror, { render,Router } from "mirrorx";

import MainLayout from "./layout";

import './static/trd/tineper-bee/assets/tinper-bee.css'
import "./app.less";

const MiddlewareConfig = [];

import en from './locales/en-US'
import zh from './locales/zh-Hans-CN'

let LANG_MODE = 'zh';
let appLocale = {};

if(LANG_MODE == 'en') appLocale = en;
if(LANG_MODE == 'zh') appLocale = zh;

addLocaleData(appLocale.data);

if (__MODE__ == "development") {
    
    MiddlewareConfig.push(logger);
}

mirror.defaults({
    historyMode: "hash",
    middlewares: MiddlewareConfig
});

render(
    <Locale locale={appLocale.tinperBee}>
        <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
            <Router>
                <MainLayout />
            </Router>
        </IntlProvider>
    </Locale>,
    document.querySelector("#app"));

