const COLOR_BLURPLE = '#526DD1' // Kept incase missed any variable references

const COLOR_DARK = '#151515'
const COLOR_DARKER = '#101010'
const COLOR_PRIMARY = '#8C977D'
const COLOR_YELLOW = '#D9BC8C'
const COLOR_RED = '#B66467'
const COLOR_WHITE = '#E8E3E3'


const swapLogo = async function() {
	const imgElements = document.getElementsByTagName('img');
	var found = false;
	for (var i = 0; i< imgElements.length; i++) {
		var node = imgElements[i]
		if (node.src.includes('proxmox_logo.png')) {
			found = true;
			var width = (node.parentElement.clientWidth == undefined || node.parentElement.clientWidth == 0) ? 172 : node.parentElement.clientWidth;
			var height = (node.parentElement.clientHeight == undefined || node.parentElement.clientHeight == 0) ? 30 : node.parentElement.clientHeight;
			node.parentElement.parentElement.style.background = COLOR_DARKER;
			node.setAttribute('height', `${height}px`);
			node.setAttribute('width', `${width}px`);
			node.setAttribute('src', '/pve2/images/dd_logo.png');
		}
	}
	if (!found) {
		await new Promise(resolve => setTimeout(resolve, 60));
		await swapLogo();
	};
};

const patchCharts = function() {
	Ext.chart.theme.Base.prototype.config.chart.defaults.background = COLOR_DARKER;
	Ext.chart.theme.Base.prototype.config.axis.defaults.label.color = COLOR_WHITE;
	Ext.chart.theme.Base.prototype.config.axis.defaults.title.color = COLOR_WHITE;
	Ext.chart.theme.Base.prototype.config.axis.defaults.style.strokeStyle = COLOR_PRIMARY;
	Ext.chart.theme.Base.prototype.config.axis.defaults.grid.strokeStyle = 'rgba(21, 21, 21, 1)'; // COLOR_DARK
	Ext.chart.theme.Base.prototype.config.sprites.text.color = COLOR_WHITE;
};

function patchGaugeWidget() {
	Proxmox.panel.GaugeWidget.prototype.backgroundColor = COLOR_DARK;
	Proxmox.panel.GaugeWidget.prototype.criticalColor = COLOR_RED;
	Proxmox.panel.GaugeWidget.prototype.warningColor = COLOR_YELLOW;
	Proxmox.panel.GaugeWidget.prototype.defaultColor = COLOR_PRIMARY;
	Proxmox.panel.GaugeWidget.prototype.items[1].series[0].colors[0] = COLOR_DARK;
};

function patchBackupConfig() {
	PVE.window.BackupConfig.prototype.items.style['background-color'] = COLOR_DARKER;
};

function patchDiskSmartWindow() {
	const target = PVE.DiskSmartWindow || Proxmox.window.DiskSmart;
	target.prototype.items[1].style['background-color'] = COLOR_DARKER;
}

function patchTFAEdit() {
	if (PVE.window.TFAEdit) PVE.window.TFAEdit.prototype.items[0].items[0].items[1].style["background-color"] = 'transparent';
}

function patchCreateWidget() {
	_createWidget = Ext.createWidget
	Ext.createWidget = function(c, p) {
		if (typeof p === 'object' && typeof p.style === 'object') {
			if (c === 'component' && typeof p.style['background-color'] === 'string' && p.style['background-color'] === COLOR_WHITE) p.style['background-color'] = COLOR_DARK
		}
		return _createWidget(c, p)
	}
}

swapLogo();
patchCharts();
patchGaugeWidget();
patchBackupConfig();
patchDiskSmartWindow();
patchTFAEdit();
patchCreateWidget();
console.log('ProxmoxDark :: Patched');
