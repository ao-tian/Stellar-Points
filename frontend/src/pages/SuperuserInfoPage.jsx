import { AppShell } from "../components/layout";
import { Card } from "../components/ui";

export default function SuperuserInfoPage() {
    return (
        <AppShell
            title="Superuser Information"
            subtitle="Understanding your superuser privileges"
        >
            <Card>
                <div className="space-y-6">
                    <div className="rounded-2xl border-2 border-warning bg-warning/10 p-6">
                        <h2 className="text-2xl font-bold text-warning mb-2">
                            ⭐ Superuser Account
                        </h2>
                        <p className="text-base text-neutral/80">
                            You are logged in as a <strong>superuser</strong> - an account with the highest priority level used for development and system administration.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral">Access All Features</h3>
                        <p className="text-base text-neutral/70">
                            As a superuser, you have access to all features across all roles in the system:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base text-neutral/70 ml-4">
                            <li><strong>Regular User Interface:</strong> View and manage your personal account, points, transactions, and promotions</li>
                            <li><strong>Cashier Interface:</strong> Process transactions, create purchases, and handle redemptions</li>
                            <li><strong>Manager Interface:</strong> Manage users, transactions, promotions, and events with administrative privileges</li>
                            <li><strong>Organizer Interface:</strong> Create and manage events</li>
                            <li><strong>Superuser Interface:</strong> Full system access including user role management</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral">Interface Switching</h3>
                        <p className="text-base text-neutral/70">
                            Use the interface dropdown in the navigation bar to switch between different role interfaces. This allows you to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base text-neutral/70 ml-4">
                            <li>Test features from different user perspectives</li>
                            <li>Debug issues across different role contexts</li>
                            <li>Perform administrative tasks efficiently</li>
                            <li>Verify system behavior for all user types</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral">Superuser vs Manager</h3>
                        <div className="bg-base-200 rounded-lg p-4 space-y-2">
                            <p className="text-base text-neutral/70">
                                <strong>Superuser:</strong> Can access all interfaces (Regular, Cashier, Manager, Organizer) via dropdown menu. Full system access for development and testing.
                            </p>
                            <p className="text-base text-neutral/70">
                                <strong>Manager:</strong> Can only access the Manager interface. No interface switching dropdown. Limited to manager-level administrative tasks.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral">Important Notes</h3>
                        <div className="bg-base-200 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-neutral/70">
                                • Superuser accounts are intended for development and system administration purposes
                            </p>
                            <p className="text-sm text-neutral/70">
                                • Exercise caution when making changes that affect other users
                            </p>
                            <p className="text-sm text-neutral/70">
                                • Superusers can promote/demote managers and other superusers
                            </p>
                            <p className="text-sm text-neutral/70">
                                • All actions are logged and traceable
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </AppShell>
    );
}

