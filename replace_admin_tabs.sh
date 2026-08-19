#!/bin/bash
sed -i 's/if (tab === '\''portfolio'\'') return '\''portfolios'\'';/if (tab === '\''portfolio'\'') return curatedSpace === '\''verbal'\'' ? '\''portfolios'\'' : '\''visuals'\'';/g' src/pages/Admin.tsx
sed -i 's/if (tab === '\''visual'\'') return '\''visuals'\'';//g' src/pages/Admin.tsx

sed -i 's/if (activeTab === '\''visual'\'') {/if (activeTab === '\''portfolio'\'' \&\& curatedSpace === '\''visual'\'') {/g' src/pages/Admin.tsx
sed -i 's/} else if (activeTab === '\''portfolio'\'') {/} else if (activeTab === '\''portfolio'\'' \&\& curatedSpace === '\''verbal'\'') {/g' src/pages/Admin.tsx

sed -i 's/{activeTab === '\''visual'\'' \&\& (/{activeTab === '\''portfolio'\'' \&\& curatedSpace === '\''visual'\'' \&\& (/g' src/pages/Admin.tsx
