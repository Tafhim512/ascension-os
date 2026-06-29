import { Settings as SettingsIcon, Database, Moon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-muted tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-text-secondary" />
          Settings
        </h1>
        <p className="text-text-secondary">Configure your Ascension OS experience.</p>
      </header>

      <div className="grid border border-border/50 divide-y divide-border/50 rounded-xl bg-bg-elevated/40 backdrop-blur-md overflow-hidden max-w-3xl">
        <div className="p-6 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h3 className="font-bold text-white">Database Connection</h3>
              <p className="text-sm text-text-muted">Currently using fast local SQLite development database.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-accent-blue text-xs font-bold text-bg-primary rounded-sm tracking-wider uppercase">Connected</span>
        </div>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
              <Moon className="w-5 h-5 text-accent-purple" />
            </div>
            <div>
              <h3 className="font-bold text-white">Theme</h3>
              <p className="text-sm text-text-muted">Ascension OS strictly enforces dark mode to protect your eyes during deep work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
