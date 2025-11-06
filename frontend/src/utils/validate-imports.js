/**
 * Script para validar que todos los iconos importados de MUI existan
 * Ejecutar antes de crear nuevos archivos con: node validate-imports.js
 */

const fs = require('fs');
const path = require('path');

// Iconos comunes de MUI disponibles
const COMMON_MUI_ICONS = [
    'Add', 'Edit', 'Delete', 'Search', 'FilterList', 'Visibility', 'Refresh',
    'Download', 'Upload', 'Print', 'Settings', 'Close', 'Check', 'Cancel',
    'ArrowBack', 'ArrowForward', 'ArrowUpward', 'ArrowDownward',
    'MoreVert', 'MoreHoriz', 'Menu', 'Home', 'Dashboard', 'Person',
    'People', 'Email', 'Phone', 'LocationOn', 'Schedule', 'TrendingUp',
    'TrendingDown', 'Assessment', 'Analytics', 'BarChart', 'PieChart',
    'LineChart', 'ShowChart', 'Insights', 'BusinessCenter', 'Store',
    'ShoppingCart', 'Inventory', 'AttachMoney', 'AccountBalance',
    'Receipt', 'Description', 'Folder', 'FolderOpen', 'Image',
    'CloudUpload', 'CloudDownload', 'Autorenew', 'Sync', 'Loop',
    'Build', 'Construction', 'Settings', 'SettingsApplications',
    'AdminPanelSettings', 'ManageAccounts', 'AccountCircle',
    'Lock', 'LockOpen', 'Security', 'VerifiedUser', 'Block',
    'CheckCircle', 'Error', 'Warning', 'Info', 'Help',
    'NotificationImportant', 'Notifications', 'NotificationsNone',
    'Save', 'SaveAlt', 'NoteAdd', 'Create', 'Edit', 'ContentCopy',
    'Delete', 'Clear', 'ExitToApp', 'Logout', 'Login', 'VpnKey',
    'Visibility', 'VisibilityOff', 'Launch', 'OpenInNew',
    'PlayArrow', 'Pause', 'Stop', 'SkipNext', 'SkipPrevious',
    'PowerSettingsNew', 'RestartAlt', 'Power', 'TurnOn',
    'Speed', 'Timer', 'AccessTime', 'Schedule',
    'SmartToy', 'Robot', 'Psychology', 'AutoAwesome',
    'LocalShipping', 'FlightTakeoff', 'FlightLand',
    'Work', 'Business', 'Domain', 'CorporateFare',
    'Assignment', 'Task', 'CheckCircle', 'RadioButtonChecked',
    'ToggleOn', 'ToggleOff', 'Switch', 'Lens',
    'Circle', 'Star', 'StarBorder', 'Favorite', 'FavoriteBorder',
    'ThumbUp', 'ThumbDown', 'ThumbsUpDown', 'RateReview',
    'Chat', 'Forum', 'Comment', 'Feedback', 'Reviews',
    'Support', 'HelpOutline', 'ContactSupport', 'QuestionAnswer',
    'Description', 'Article', 'Note', 'StickyNote', 'TextFields',
    'Title', 'Subject', 'ShortText', 'ViewHeadline',
    'Image', 'Photo', 'PhotoLibrary', 'Wallpaper', 'Collections',
    'Filter', 'Tune', 'Sort', 'SortByAlpha', 'SwapVert', 'SwapHoriz',
    'GridOn', 'ViewList', 'ViewModule', 'ViewQuilt', 'Apps',
    'Fullscreen', 'FullscreenExit', 'ZoomIn', 'ZoomOut', 'Zoom',
    'Details', 'Info', 'InfoOutline', 'Help', 'HelpOutline',
    'KeyboardArrowDown', 'KeyboardArrowUp', 'KeyboardArrowLeft',
    'KeyboardArrowRight', 'ExpandMore', 'ExpandLess',
    'ChevronLeft', 'ChevronRight', 'ChevronDown', 'ChevronUp',
    'ArrowDropDown', 'ArrowDropUp', 'ArrowLeft', 'ArrowRight',
    'FirstPage', 'LastPage', 'NavigateBefore', 'NavigateNext',
];

function validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const issues = [];
    let inImports = false;
    let importLine = '';
    let lineNumber = 0;
    
    lines.forEach((line, index) => {
        lineNumber = index + 1;
        
        if (line.includes('from \'@mui/icons-material\'')) {
            inImports = true;
            importLine = line;
        }
        
        if (inImports) {
            // Extract icon names from import statement
            const iconMatches = line.match(/\b([A-Z][a-zA-Z0-9]+)\b/g);
            if (iconMatches && line.includes('}')) {
                const icons = iconMatches.filter(icon => 
                    !['import', 'from', '}'].includes(icon)
                );
                
                icons.forEach(icon => {
                    if (!COMMON_MUI_ICONS.includes(icon)) {
                        issues.push({
                            line: lineNumber,
                            icon,
                            message: `Icono "${icon}" no es común en MUI. Verificar si existe.`
                        });
                    }
                });
                
                inImports = false;
            }
        }
    });
    
    return issues;
}

function scanDirectory(dir, issues = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules')) {
            scanDirectory(filePath, issues);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const fileIssues = validateFile(filePath);
            if (fileIssues.length > 0) {
                issues.push({ file: filePath, issues: fileIssues });
            }
        }
    });
    
    return issues;
}

// Ejecutar validación
const srcDir = path.join(__dirname, '..');
const allIssues = scanDirectory(srcDir);

if (allIssues.length > 0) {
    console.log('⚠️  Se encontraron posibles problemas con iconos de MUI:\n');
    allIssues.forEach(({ file, issues }) => {
        console.log(`📄 ${file}`);
        issues.forEach(({ line, icon, message }) => {
            console.log(`   Línea ${line}: ${icon} - ${message}`);
        });
        console.log('');
    });
    process.exit(1);
} else {
    console.log('✅ Todos los iconos de MUI son válidos');
    process.exit(0);
}







