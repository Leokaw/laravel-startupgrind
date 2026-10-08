<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CompanyEmployeeController extends Controller
{
    /**
     * Unlink an employee from the authenticated company.
     *
     * The user account itself is NOT deleted — it simply loses its
     * company_id and reverts to a regular "user".
     */
    public function destroy(Request $request, User $employee): RedirectResponse
    {
        $company = $request->user();

        abort_unless($company->isCompany(), 403, 'Only company accounts can manage employees.');
        abort_unless($employee->company_id === $company->id, 403, 'This user is not part of your company.');

        $employee->forceFill([
            'company_id' => null,
            'user_type'  => User::TYPE_USER,
        ])->save();

        return redirect()
            ->back()
            ->with('success', 'Employee removed from your company.');
    }
}