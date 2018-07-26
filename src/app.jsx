/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React, {Component} from "react";
import 'core-js/es6/map';
import 'core-js/es6/set';
import logger from "redux-logger";
import mirror, { render,Router } from "mirrorx";

import MainLayout from "./layout";

import './static/trd/tineper-bee/assets/tinper-bee.css'
import "./app.less";
import Intl from './components/Intl/index.js'
const MiddlewareConfig = [];

if (__MODE__ == "development") {
    
    MiddlewareConfig.push(logger);
}

mirror.defaults({
    historyMode: "hash",
    middlewares: MiddlewareConfig
});

render(
    <Intl>
        <Router>
            <MainLayout />
        </Router>
    </Intl>,
    document.querySelector("#app")
);