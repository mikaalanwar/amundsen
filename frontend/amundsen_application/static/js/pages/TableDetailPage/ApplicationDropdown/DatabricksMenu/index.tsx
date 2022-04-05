// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { MenuItem, OverlayTrigger, Popover } from 'react-bootstrap';

import { TableApp } from 'interfaces';
import { DATABRICKS, DELAY_SHOW_POPOVER_MS } from '../constants';
import '../styles.scss';

export interface DatabricksMenuProps {
  tableApps: TableApp[];
  getSortedAppKinds: (apps: TableApp[]) => string[];
  hasSameNameAndKind: (app: TableApp, name: string, kind: string) => boolean;
  handleClick: (event) => void;
}

const getMenuItem = (app: TableApp, handleClick) => (
  <OverlayTrigger
    key={app.id}
    trigger={['hover', 'focus']}
    placement="top"
    delayShow={DELAY_SHOW_POPOVER_MS}
    overlay={<Popover id="popover-trigger-hover-focus">{app.id}</Popover>}
  >
    <MenuItem
      href={app.application_url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="application-dropdown-menu-item-row">
        <span className="menu-item-content">{app.id}</span>
      </div>
    </MenuItem>
  </OverlayTrigger>
);

const DatabricksMenu: React.FC<DatabricksMenuProps> = ({
  tableApps,
  getSortedAppKinds,
  hasSameNameAndKind,
  handleClick,
}: DatabricksMenuProps) => {
  // Group the applications in the dropdown by kind
  let menuItems: React.ReactNode[] = [];
  const appKinds = getSortedAppKinds(tableApps);
  appKinds.forEach((kind, kindIdx) => {
    menuItems = [
      ...menuItems,
      <h5 key={kind} className="application-dropdown-menu-title">
        {kind}
      </h5>,
      ...tableApps
        .filter((app) => hasSameNameAndKind(app, DATABRICKS, kind))
        .map((app) => getMenuItem(app, handleClick)),
    ];

    const isLastApp = kindIdx + 1 < appKinds.length;
    if (isLastApp) {
      menuItems = [...menuItems, <MenuItem divider />];
    }
  });

  return <>{menuItems}</>;
};

export default DatabricksMenu;
