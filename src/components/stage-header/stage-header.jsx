import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Controls from '../../containers/controls.jsx';

import {STAGE_SIZES} from '../../reducers/stage-size';

import fullScreenIcon from './icon--fullscreen.svg';
import largeStageIcon from './icon--large-stage.svg';
import smallStageIcon from './icon--small-stage.svg';
import unFullScreenIcon from './icon--unfullscreen.svg';

import styles from './stage-header.css';

const largeStageSizeMessage = (
    <FormattedMessage
        defaultMessage="Stage Size Toggle - Large"
        description="Button to change stage size to large"
        id="gui.gui.stageSizeLarge"
    />
);

const smallStageSizeMessage = (
    <FormattedMessage
        defaultMessage="Stage Size Toggle - Small"
        description="Button to change stage size to small"
        id="gui.gui.stageSizeSmall"
    />
);

const fullStageSizeMessage = (
    <FormattedMessage
        defaultMessage="Stage Size Toggle - Full Screen"
        description="Button to change stage size to full screen"
        id="gui.gui.stageSizeFull"
    />
);

const unFullStageSizeMessage = (
    <FormattedMessage
        defaultMessage="Stage Size Toggle - Un-full screen"
        description="Button to get out of full screen mode"
        id="gui.gui.stageSizeUnFull"
    />
);

const StageHeaderComponent = function (props) {
    const {
        stageSize,
        isFullScreen,
        onSetStageLarge,
        onSetStageFull,
        onSetStageUnFull,
        vm
    } = props;

    let header = null;

    if (isFullScreen) {
        header = (
            <Box className={styles.stageHeaderWrapperOverlay}>
                <Box className={styles.stageMenuWrapper}>
                    <Controls vm={vm} />
                    <Button
                        className={classNames(
                            styles.stageButton,
                            styles.stageButtonActive
                        )}
                        onClick={onSetStageUnFull}
                    >
                        <img
                            alt={unFullStageSizeMessage}
                            className={styles.stageButtonIcon}
                            src={unFullScreenIcon}
                        />
                    </Button>
                </Box>
            </Box>
        );
    } else {
        header = (
            <Box className={styles.stageHeaderWrapper}>
                <Box className={styles.stageMenuWrapper}>
                    <Controls vm={vm} />
                    <div className={styles.stageSizeRow}>
                        <div className={styles.stageSizeToggleGroup}>
                            <ComingSoonTooltip
                                place="left"
                                tooltipId="small-stage-button"
                            >
                                <div
                                    disabled
                                    className={classNames(
                                        styles.stageButton,
                                        styles.stageButtonLeft,
                                        styles.stageButtonDisabled
                                    )}
                                    role="button"
                                >
                                    <img
                                        disabled
                                        alt={smallStageSizeMessage}
                                        className={styles.stageButtonIcon}
                                        src={smallStageIcon}
                                    />
                                </div>
                            </ComingSoonTooltip>
                            <div>
                                <Button
                                    className={classNames(
                                        styles.stageButton,
                                        styles.stageButtonRight,
                                        {
                                            [styles.stageButtonActive]: stageSize === STAGE_SIZES.large
                                        }
                                    )}
                                    onClick={onSetStageLarge}
                                >
                                    <img
                                        alt={largeStageSizeMessage}
                                        className={styles.stageButtonIcon}
                                        src={largeStageIcon}
                                    />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Button
                                className={styles.stageButton}
                                onClick={onSetStageFull}
                            >
                                <img
                                    alt={fullStageSizeMessage}
                                    className={styles.stageButtonIcon}
                                    src={fullScreenIcon}
                                />
                            </Button>
                        </div>
                    </div>
                </Box>
            </Box>
        );
    }

    return header;
};

StageHeaderComponent.propTypes = {
    isFullScreen: PropTypes.bool.isRequired,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageLarge: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageHeaderComponent;
