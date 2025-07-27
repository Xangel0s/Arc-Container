const path = require('path');
const fs = require('fs');

const iconConfig = {
    iconPath: path.join(__dirname, 'assets', 'icon.ico'),
    
    exists: function() {
        return fs.existsSync(this.iconPath);
    },
    
    getInfo: function() {
        if (this.exists()) {
            const stats = fs.statSync(this.iconPath);
            return {
                path: this.iconPath,
                size: stats.size,
                modified: stats.mtime
            };
        }
        return null;
    },
    
    windowsConfig: {
        appId: 'com.arccontainer.app.v2',
        appIconPath: path.join(__dirname, 'assets', 'icon.ico'),
        appIconIndex: 0,
        relaunchDisplayName: 'Arc Container',
        relaunchCommand: process.execPath
    }
};

module.exports = iconConfig; 